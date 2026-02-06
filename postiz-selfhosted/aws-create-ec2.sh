#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

if [[ -f "$SCRIPT_DIR/aws.env" ]]; then
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/aws.env"
fi

: "${AWS_REGION:?AWS_REGION is required}"
: "${AWS_PROFILE:?AWS_PROFILE is required}"
: "${KEY_NAME:?KEY_NAME is required}"
: "${INSTANCE_TYPE:?INSTANCE_TYPE is required}"
: "${SG_NAME:?SG_NAME is required}"
: "${TAG_NAME:?TAG_NAME is required}"
if [[ -z "${SSH_CIDR:-}" ]]; then
  if command -v curl >/dev/null 2>&1; then
    IP=$(curl -s https://checkip.amazonaws.com || true)
    if [[ -z "$IP" ]]; then
      IP=$(curl -s https://ifconfig.me || true)
    fi
    if [[ -n "$IP" ]]; then
      SSH_CIDR="${IP}/32"
      export SSH_CIDR
    fi
  fi
fi

: "${SSH_CIDR:?SSH_CIDR is required (example: 1.2.3.4/32)}"

AWS="aws --profile ${AWS_PROFILE} --region ${AWS_REGION}"

AMI_ID=$($AWS ec2 describe-images \
  --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
           "Name=state,Values=available" \
  --query "Images | sort_by(@, &CreationDate) | [-1].ImageId" \
  --output text)

VPC_ID=$($AWS ec2 describe-vpcs --query "Vpcs[0].VpcId" --output text)

# Key pair
if ! $AWS ec2 describe-key-pairs --key-names "$KEY_NAME" >/dev/null 2>&1; then
  $AWS ec2 create-key-pair \
    --key-name "$KEY_NAME" \
    --query "KeyMaterial" \
    --output text > "${KEY_NAME}.pem"
  chmod 400 "${KEY_NAME}.pem"
fi

# Security group
SG_ID=$($AWS ec2 describe-security-groups \
  --filters "Name=group-name,Values=${SG_NAME}" "Name=vpc-id,Values=${VPC_ID}" \
  --query "SecurityGroups[0].GroupId" \
  --output text)

if [[ "$SG_ID" == "None" ]]; then
  SG_ID=$($AWS ec2 create-security-group \
    --group-name "$SG_NAME" \
    --description "Postiz security group" \
    --vpc-id "$VPC_ID" \
    --query "GroupId" \
    --output text)
fi

# Ingress rules
$AWS ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 22 --cidr "$SSH_CIDR" || true
$AWS ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0 || true
$AWS ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 443 --cidr 0.0.0.0/0 || true
$AWS ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 4200 --cidr 0.0.0.0/0 || true

INSTANCE_ID=$($AWS ec2 run-instances \
  --image-id "$AMI_ID" \
  --instance-type "$INSTANCE_TYPE" \
  --key-name "$KEY_NAME" \
  --security-group-ids "$SG_ID" \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$TAG_NAME}]" \
  --query "Instances[0].InstanceId" \
  --output text)

$AWS ec2 wait instance-running --instance-ids "$INSTANCE_ID"

PUBLIC_IP=$($AWS ec2 describe-instances \
  --instance-ids "$INSTANCE_ID" \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text)

echo "INSTANCE_ID=$INSTANCE_ID"
echo "PUBLIC_IP=$PUBLIC_IP"

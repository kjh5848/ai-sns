# 데이터 모델 (초안)

## users
- id
- email
- password_hash
- created_at

## auth_sessions
- id
- user_id
- refresh_token
- expires_at

## buffer_tokens
- id
- user_id
- access_token
- refresh_token
- expires_at

## accounts
- id
- user_id
- provider (instagram|threads|x|facebook)
- provider_account_id
- status
- created_at

## posts
- id
- user_id
- text
- media_urls
- status (draft|scheduled|published|failed)
- scheduled_at
- published_at
- created_at

## post_channels
- post_id
- account_id

## post_events
- id
- post_id
- type (scheduled|published|failed|retry)
- payload
- created_at

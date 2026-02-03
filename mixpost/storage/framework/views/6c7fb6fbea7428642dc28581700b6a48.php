<div <?php echo e($attributes->merge(['class' => 'flex justify-between items-center'])); ?>>
    <div class="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="flex justify-start w-full font-semibold sm:mr-xs">
            <?php echo e($title); ?>

        </div>

        <div class="w-full flex justify-end mt-xs sm:mt-0">
           <?php echo e($slot); ?>

        </div>
    </div>
</div>
<?php /**PATH /var/www/html/vendor/inovector/mixpost-auth/resources/views/components/horizontal-group.blade.php ENDPATH**/ ?>
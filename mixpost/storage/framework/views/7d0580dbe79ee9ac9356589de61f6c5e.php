<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['id', 'name']));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter((['id', 'name']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>
<div <?php echo e($attributes->merge(['class' => 'block'])); ?> id="<?php echo e($id); ?>">
    <label class="inline-flex items-center">
        <input id="<?php echo e($id); ?>" type="checkbox"
               class="w-5 h-5 rounded-md border-stone-600 text-indigo-600 shadow-xs focus:ring-3 focus:ring-indigo-200/50"
               name="<?php echo e($name); ?>">
        <span class="ml-xs text-gray-600"><?php echo e($slot); ?></span>
    </label>
</div>
<?php /**PATH /var/www/html/vendor/inovector/mixpost-auth/resources/views/components/checkbox.blade.php ENDPATH**/ ?>
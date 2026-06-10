<script lang="ts">
	import '@aryagg/theme';
	let { children } = $props();
</script>

<div class="h-screen w-screen">
	{@render children()}
</div>

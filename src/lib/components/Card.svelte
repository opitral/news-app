<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	const { children, class: className }: Props = $props();
</script>

<div class="rounded-md border p-5 shadow-md {className}">
	{@render children()}
</div>

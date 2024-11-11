<script lang="ts">
	import type { PageData } from './$types';
	import { Eye, Heart, MessageSquare } from 'lucide-svelte';
	import { getRelativeTime } from '$lib/time-util';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import Card from '$lib/components/Card.svelte';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
</script>

{#snippet stat(Icon: any, value: number)}
	<div class="flex items-center gap-1">
		<Icon class="size-4 text-gray-500" />
		<span class=" text-gray-500">{value}</span>
	</div>
{/snippet}

<Wrapper class="pt-10">
	<div class="flex flex-col gap-5">
		{#each data.news as item}
			<a href="/news/{item.id}">
				<Card class="flex gap-5 max-md:flex-col">
					<div class="aspect-video shrink-0 overflow-hidden rounded-md md:aspect-square md:size-32">
						{#if item.image}
							<img src={item.image} class="size-full object-cover" alt="" />
						{:else if item.video}
							<svg
								class="size-full"
								viewBox="0 0 512 512"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect width="512" height="512" fill="#DDDDDD" />
								<path
									d="M335 247.34C341.667 251.189 341.667 260.811 335 264.66L224 328.746C217.333 332.595 209 327.784 209 320.086L209 191.914C209 184.216 217.333 179.405 224 183.254L335 247.34Z"
									fill="#999999"
								/>
							</svg>
						{:else}
							<img src="/no-media.svg" alt="" />
						{/if}
					</div>

					<div>
						<h3 class="text-wrap text-lg font-medium">{item.title}</h3>
						<p class=" text-wrap">{item.content}</p>
					</div>

					<div class="flex grow flex-row-reverse items-end justify-between md:flex-col">
						<p class="text-sm text-gray-500">{getRelativeTime(item.createdAt)}</p>

						<div class=" flex items-center gap-3 self-end">
							{@render stat(Eye, item.views)}
							{@render stat(Heart, item.likes)}
							{@render stat(MessageSquare, item.comments)}
						</div>
					</div>
				</Card>
			</a>
		{/each}
	</div>
</Wrapper>

<script lang="ts">
	import type { PageData } from './$types';
	import { Eye, Heart, MessageSquare, ArrowLeft, Send } from 'lucide-svelte';
	import { getRelativeTime } from '$lib/time-util';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import Card from '$lib/components/Card.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	let mounted = $state(false);


	onMount(() => {
		mounted = true;
	});

	// console.log(data);
</script>

{#snippet stat(Icon: any, value: number)}
	<div class="flex items-center gap-2">
		<Icon class="size-5 text-gray-500" />
		<span class="text-lg text-gray-500">{value}</span>
	</div>
{/snippet}

<Wrapper class="mt-10">
	<Card class="flex flex-col gap-5">
		<div class="flex items-center justify-between">
			<a href="/" class="flex items-center gap-2">
				<ArrowLeft class="size-6" />
				<span class="font-medium">Main page</span>
			</a>

			{#if mounted}
				<form
					action="?/like"
					method="POST"
					use:enhance={() =>
						({ result }) => {
							console.log(result);

							if (result.type == 'success') {
								invalidateAll();
							} else {
								alert('Failed to like');
							}
						}}
				>
					<input name="isLiked" type="hidden" value={data.isLiked} />
					<button>
						<Heart class="size-7 {data.isLiked ? 'fill-red-500 text-red-500' : ''}" />
					</button>
				</form>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-5">
			<div class="overflow-hidden rounded-md">
				{#if data.video}
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
					<img class="size-full object-cover" src={data.image || '/no-media.svg'} alt="" />
				{/if}
			</div>

			<div>
				<h3 class="text-3xl font-medium">{data.title}</h3>
				<p class="text-lg">{data.content}</p>
			</div>
		</div>

		<div class="flex grow items-end justify-between">
			<div class=" datas-center flex gap-3 self-end">
				{@render stat(Eye, data.views)}
				{@render stat(Heart, data.likes)}
				{@render stat(MessageSquare, data.comments.length)}
			</div>

			<p class="text-lg text-gray-500">{getRelativeTime(data.createdAt)}</p>
		</div>
	</Card>

	<Card class="my-10">
		<h3 class="text-xl font-medium">Comments</h3>
		<div class="divide-y divide-gray-200 py-2">
			{#each data.comments as comment}
				<div class="flex flex-col py-2">
					<div class="flex items-center justify-between gap-2 text-gray-500">
						<p>{comment.user.username}</p>
						<p>{getRelativeTime(comment.date)}</p>
					</div>

					<p class="mt-1 text-lg">{comment.content}</p>
				</div>
			{:else}
				<p class="my-5 text-gray-500 text-center">No comments</p>
			{/each}
		</div>

		<form
			class="flex items-center gap-3"
			action="?/submit_comment"
			id="form-comment"
			method="POST"
			use:enhance={() =>
				({ result }) => {
					if (result.type == 'success') {
						invalidateAll();
						document.querySelector<HTMLInputElement>('input[name="comment"]')!.value = '';
					}
				}}
		>
			<input
				name="comment"
				class="w-full rounded-md border border-gray-200 p-3"
				type="text"
				placeholder="Write a comment..."
				required
			/>

			<button class="shrink-0 rounded-md bg-slate-500 p-3 text-white">
				<Send class="size-6" />
			</button>
		</form>
	</Card>
</Wrapper>

<script lang="ts">
	import type { PageData } from './$types';
	import { Eye, Heart, MessageSquare, ArrowLeft, Send } from 'lucide-svelte';
	import { getRelativeTime } from '$lib/time-util';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import Card from '$lib/components/Card.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	function goBack() {
		if (window.history.length > 1) {
      history.back();
    } else {
      goto('/');
    }
	}

	// console.log(data);
</script>

{#snippet stat(Icon: any, value: number)}
	<div class="flex items-center gap-1 md:gap-2">
		<Icon class="size-4 text-gray-500 md:size-5" />
		<span class="text-gray-500 md:text-lg">{value}</span>
	</div>
{/snippet}

<Wrapper class="mt-10">
	<Card class="flex flex-col gap-5">
		<div class="flex items-center justify-between">
			<button onclick={goBack} class="flex items-center gap-2">
				<ArrowLeft class="size-6" />
				<span class="font-medium">Main page</span>
			</button>

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

		<!-- <div>
			<img class="float-left aspect-square w-1/2" src={data.image || '/no-media.svg'} alt="" />
			<p class="">{data.content}</p>
		</div> -->

		<div class="">
			<div class="mr-5 aspect-square w-full overflow-hidden rounded-md md:float-left md:w-1/2">
				{#if data.video}
					<video class="size-full object-cover" src={data.video} controls>
						<track kind="captions" />
					</video>
				{:else}
					<img class="size-full object-cover" src={data.image || '/no-media.svg'} alt="" />
				{/if}
			</div>

			<!-- <div class="inline-block"> -->
			<h3 class="text-xl font-medium max-md:pt-5 md:text-3xl">{data.title}</h3>
			<p class="mt-2 text-lg">{data.content}</p>
			<!-- </div> -->
		</div>

		<div class="flex grow items-end justify-between">
			<div class="flex items-center gap-3 self-end">
				{@render stat(Eye, data.views)}
				{@render stat(Heart, data.likes)}
				{@render stat(MessageSquare, data.comments.length)}
			</div>

			<p class="text-gray-500 md:text-lg">{getRelativeTime(data.createdAt)}</p>
		</div>
	</Card>

	<Card class="my-10">
		<h3 class="text-md font-medium md:text-xl">Comments</h3>
		<div class="divide-y divide-gray-200 py-2">
			{#each data.comments as comment}
				<div class="flex flex-col py-2">
					<div class="flex items-center justify-between gap-2 text-gray-500">
						<p>{comment.user.username}</p>
						<p>{getRelativeTime(comment.date)}</p>
					</div>

					<p class="mt-1 md:text-lg">{comment.content}</p>
				</div>
			{:else}
				<p class="my-5 text-gray-500 text-center">No comments</p>
			{/each}
		</div>

		<form
			class="flex gap-3"
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
				class="w-full rounded-md border border-gray-200 px-2"
				type="text"
				placeholder="Write a comment..."
				required
			/>

			<button class="shrink-0 rounded-md bg-slate-500 p-2 md:p-3 text-white">
				<Send class="size-5 md:size-6" />
			</button>
		</form>
	</Card>
</Wrapper>

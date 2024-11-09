<script lang="ts">
    import type { PageData } from './$types';

    interface Props {
        data: PageData;
    }

    const { data }: Props = $props();

</script>

{
    JSON.stringify(data)
}
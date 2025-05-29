<script lang="ts">
    import { onMount } from 'svelte';

    interface Device {
        id: string;
        name: string;
        deviceId: string;
        apiKey: string;
    }

    let devices: Device[] = [];
    let error: string | null = null;

    onMount(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login'; // Redirect to login page
                return;
            }

            const response = await fetch('http://localhost:3000/api/device', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch devices: ${response.statusText}`);
            }

            const data: Device[] = await response.json();
            devices = data.map(device => ({
                id: device.id,
                name: device.name,
                deviceId: device.deviceId,
                apiKey: device.apiKey
            }));
        } catch (err) {
            error = (err as Error).message;
        }
    });
</script>

{#if error}
    <p class="error">{error}</p>
{:else if devices.length === 0}
    <p>No devices found.</p>
{:else}
    <ul>
        {#each devices as device}
            <li>
                <strong>ID:</strong> {device.id}, <strong>Name:</strong> {device.name}, <strong>Device ID:</strong> {device.deviceId}
                <button on:click={() => navigator.clipboard.writeText(device.apiKey)}>Copy API Key</button>
            </li>
        {/each}
    </ul>
{/if}

<style>
    .error {
        color: red;
    }
</style>
<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    // Supprime le token de la session et redirige vers la page d'accueil
    onMount(async () => {
        localStorage.removeItem('token'); // Supprime le token
        await goto('/'); // Redirige vers la page d'accueil
    });
</script>

<p>Déconnexion en cours...</p>
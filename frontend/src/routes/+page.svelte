<script>
  import { onMount } from 'svelte';

  let isLoggedIn = false;

  onMount(() => {
    // Vérifie si un token est présent dans le localStorage
    const token = localStorage.getItem('token');
    isLoggedIn = !!token;
  });
</script>

<h1>Bienvenue</h1>
<nav>
  {#if isLoggedIn}
    <a href="/logout">Se déconnecter</a>
  {:else}
    <a href="/login">Se connecter</a> | <a href="/register">S'inscrire</a>
  {/if}
</nav>

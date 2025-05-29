<script>
    import { onMount } from 'svelte';
  
    let email = '';
    let password = '';
    let error = '';
  
    async function handleLogin() {
      error = '';
      try {
        const res = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email, password }),
        });
  
        if (!res.ok) {
          const data = await res.json();
          error = data.message ?? 'Erreur login';
          return;
        }
  
        const data = await res.json();
        localStorage.setItem('token', data.token);
        location.href = '/';
      } catch {
        error = 'Erreur réseau';
      }
    }
  </script>
  
  <h1>Login</h1>
  
  {#if error}
    <p style="color: red">{error}</p>
  {/if}
  
  <form on:submit|preventDefault={handleLogin}>
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Mot de passe" required />
    <button type="submit">Se connecter</button>
  </form>
  
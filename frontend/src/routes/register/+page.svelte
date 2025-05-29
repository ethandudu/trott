<script>
    let email = '';
    let password = '';
    let error = '';
    let success = '';
  
    async function handleRegister() {
      error = '';
      success = '';
      try {
        const res = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
          const data = await res.json();
          error = data.message || 'Erreur inscription';
          return;
        }
        success = 'Inscription réussie, tu peux maintenant te connecter !';
        email = '';
        password = '';
        document.location.href = '/login'; // Rediriger vers la page de connexion
      } catch (e) {
        error = 'Erreur réseau';
      }
    }
  </script>
  
  <h1>Inscription</h1>
  {#if error}
    <p style="color: red">{error}</p>
  {/if}
  {#if success}
    <p style="color: green">{success}</p>
  {/if}
  
  <form on:submit|preventDefault={handleRegister}>
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Mot de passe" required />
    <button type="submit">S’inscrire</button>
  </form>
  
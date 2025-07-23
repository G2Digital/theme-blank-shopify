export default function initNewsletter() {
  const newsletterForms = document.querySelectorAll('[data-newsletter-form]');

  newsletterForms.forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const formData = new FormData(form);
      const messageDiv = form.querySelector('.newsletter-message');
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;

      // Estado de carregamento
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
      messageDiv.classList.add('hidden');

      try {
        const response = await fetch(`${window.routes?.root_url || '/'}contact`, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        const data = await response.text();
        if (data.includes('form posted successfully') || !data.includes('error')) {
          messageDiv.innerHTML = '<div class="text-green-300 text-sm">✓ Inscrição realizada com sucesso!</div>';
          form.reset();
        } else {
          messageDiv.innerHTML = '<div class="text-red-300 text-sm">✗ Erro ao inscrever. Tente novamente.</div>';
        }
      } catch {
        messageDiv.innerHTML = '<div class="text-red-300 text-sm">✗ Erro de conexão. Tente novamente.</div>';
      } finally {
        messageDiv.classList.remove('hidden');
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  });
} 
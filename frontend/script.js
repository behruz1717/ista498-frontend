document.addEventListener('DOMContentLoaded', () => {
  // Early-access form logic (index page)
  const form = document.getElementById('access-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button');
    if (!btn) return;

    const originalContent = btn.innerHTML;

    btn.innerText = 'Processing...';
    btn.style.opacity = '0.8';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerText = 'You are on the list!';
      btn.style.background = 'var(--leaf)';
      btn.style.borderColor = 'var(--leaf)';
      btn.style.color = '#fff';
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.style.opacity = '1';
        btn.disabled = false;
      }, 4000);
    }, 1500);
  });
});

export const showAlert = (type, message) => {

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

export const hideAlert = (type, message) => {
    const el = document.querySelector('.alert')
    if (el) {
        el.parentElement.removeChild(el);
    }
}

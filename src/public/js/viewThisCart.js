const viewThisCartButton = document.querySelectorAll('#viewThisCart')

viewThisCartButton.forEach(button => {
    button.addEventListener('click', () => {
        const cartId = button.dataset.cid;

        fetch(`/api/carts/${cartId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    Swal.fire({
                        title: 'Here you go chusma.',
                        text: JSON.stringify(data.payload.products),
                        icon: 'info',
                        confirmButtonText: 'Ok'
                    })
                } else {
                    alert('Something went wrong with the fetch, oh the stench of failure...' + JSON.stringify(data))
                }
            })
            .catch(error => {
                console.error('No fetch here partner! Error viewing cart:', error);
            });
    });
});





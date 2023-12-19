const deleteProductButtons = document.querySelectorAll('#deleteProduct')

deleteProductButtons.forEach(button => {
    button.addEventListener('click', () => {
        const pid = button.dataset.pid
        const title = button.dataset.title

        fetch(`/api/products/${pid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    Swal.fire({
                        title: `Product ${title} deleted`,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then((button) => {
                        if (button.isConfirmed) {
                            window.location.reload()
                        }
                    })
                } else {
                    Swal.fire({
                        title: `Scroundel!`,
                        icon: 'error',
                        text: `${data.message}`,
                        confirmButtonText: 'Ok'
                    })
                }
            })
            .catch(error => {
                console.error('Something went wrong with the fetch, oh the stench of failure...:', error);
            });
    });
});





const purchaseButton = document.getElementById('purchaseCart')

purchaseButton.addEventListener('click', () => {
    const cid = purchaseButton.dataset.purchasecartid;


    fetch(`/api/tickets/${cid}/purchase`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                Toastify({
                    text: "Cart Purchased",
                    duration: 3000,
                    newWindow: false,
                    close: true,
                    gravity: "bottom", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function () { } 
                }).showToast();
                window.location.reload()
            } else {
                alert('Something went wrong with the fetch, oh the stench of failure...' + JSON.stringify(data))
            }
        })
        .catch(error => {
            console.error('Fetch catch, Error creating the ticket', error);
        });
});






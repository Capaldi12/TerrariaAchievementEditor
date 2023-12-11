function loadFile(file) {
    console.log(file);
    alert(file.name);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function () {
        console.log(reader.result);
    }
}

// https://codepen.io/dcode-software/pen/xxwpLQo
function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

    // First time - remove the prompt
    if (dropZoneElement.querySelector('.drop-zone__prompt')) {
        dropZoneElement.querySelector('.drop-zone__prompt').remove();
    }

    // First time - there is no thumbnail element, so let's create it
    if (!thumbnailElement) {
        thumbnailElement = document.createElement('div');
        thumbnailElement.classList.add('drop-zone__thumb');
        dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;

    // Show thumbnail for image files
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
        };
    } else if (file.name.endsWith('.dat')) {
        thumbnailElement.style.backgroundImage = `url('static/favicon.png')`
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
}

window.addEventListener('load', function () {
    // File upload
    document.querySelectorAll('.drop-zone__input').forEach((inputElement) => {
        const dropZoneElement = inputElement.closest('.drop-zone');

        dropZoneElement.addEventListener('click', (e) => {
            inputElement.click();
        });

        inputElement.addEventListener('change', (e) => {
            if (inputElement.files.length) {
                updateThumbnail(dropZoneElement, inputElement.files[0]);
                loadFile(inputElement.files[0]);
            }
        });

        dropZoneElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZoneElement.classList.add('drop-zone--over');
        });

        [ 'dragleave', 'dragend' ].forEach((type) => {
            dropZoneElement.addEventListener(type, (e) => {
                dropZoneElement.classList.remove('drop-zone--over');
            });
        });

        dropZoneElement.addEventListener('drop', (e) => {
            e.preventDefault();

            const files = e.dataTransfer.files;

            if (files.length && files[0].name.endsWith('.dat')) {
                inputElement.files = files;

                updateThumbnail(dropZoneElement, inputElement.files[0]);
                loadFile(inputElement.files[0]);
            }

            dropZoneElement.classList.remove('drop-zone--over');
        });
    });
});

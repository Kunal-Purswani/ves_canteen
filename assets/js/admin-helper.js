const dropDown = document.getElementById('food-items')
firebase.database()
    .ref('Menu')
    .on('value', (snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val()
            for (item in data) {
                dropDown.innerHTML += '<option value="Menu/' + item + '">' + data[item].fields.title + '</option>'
            }
        }
    })
const removeBtn = document.getElementById('remove-btn')
removeBtn.addEventListener('click', (e) => {
    firebase.database().ref(dropDown.value).remove()
})
// for(i=26;i<=1012;i++)
//   firebase.database().ref('Menu/'+i).remove()
const title = document.getElementById('add-title');
const cal = document.getElementById('add-calories');
const price = document.getElementById('add-price');
const fileInput = document.getElementById('fileInput');
const category = document.getElementById('add-category');
const uploadButton = document.getElementById('uploadButton');
let isUploaded = false
let len = 0
let url = ''
uploadButton.addEventListener('click', () => {
    console.log(title.value, cal.value, price.value, category.value);
    firebase.database()
        .ref('Menu')
        .on('value', (snapshot) => {
            let data = snapshot.val();
            len = data.length
            const file = fileInput.files[0];

            if (file) {
                const storageRef = firebase.storage().ref('/');
                const imageRef = storageRef.child(`images/${file.name}`);

                imageRef.put(file).then((snapshot) => {
                    console.log('Image uploaded successfully');
                    snapshot.ref.getDownloadURL().then(function (url) {
                        url = url
                        if (!isUploaded) {
                            firebase.database().ref('Menu/' + len).set({
                                fields: {
                                    caleories: cal.value,
                                    category: category.value,
                                    image: {
                                        fields: {
                                            file: {
                                                url: url,
                                            }
                                        }
                                    },
                                    price: price.value,
                                    title: title.value,

                                },
                                sys: {
                                    id: len + 1,
                                }
                            }).then(() => {
                                isUploaded = true
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Product Added',
                                })
                            }).catch(error => console.error(error))
                        }
                    });
                }).catch((error) => {
                    console.error('Error uploading image:', error);
                });
            } else {
                console.error('No file selected.');
            }
        })
});
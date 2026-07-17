var fullName = document.getElementById('fullName');
var phoneNumber = document.getElementById('phoneNumber');
var emailAddress = document.getElementById('emailAddress');
var address = document.getElementById('address');
var contactGroup = document.getElementById('contactGroup');
var contactNotes = document.getElementById('contactNotes');
var contactFavorite = document.getElementById('contactFavorite');
var contactEmergency = document.getElementById('contactEmergency');
var saveContact = document.getElementById('saveContact');
var contactNameError = document.getElementById('contactNameError');
var contactPhoneError = document.getElementById('contactPhoneError');
var contactEmailError = document.getElementById('contactEmailError');
var contactsList = [];
var avatarColors = ["blue", "violet", "amber", "rose"];

// if(localStorage.getItem('contacts')){
//     contactsList = JSON.parse(localStorage.getItem('contacts'));
// } 
// else{
//     contactsList =[];
// }
// localStorage.getItem('contacts') ? contactsList = JSON.parse(localStorage.getItem('contacts')) : [];

contactsList = JSON.parse(localStorage.getItem('contacts')) || [];

displayAllContacts();

function addContacts() {
  var validName = validateAll(fullName);
  var validPhone = validateAll(phoneNumber);
  var validEmail = validateAll(emailAddress);

  if (validName&& validPhone && validEmail) {
    var contactData = {
      name: fullName.value,
      phone: phoneNumber.value,
      email: emailAddress.value,
      address: address.value,
      group: contactGroup.value,
      notes: contactNotes.value,
      favorite: contactFavorite.checked,
      emergency: contactEmergency.checked,
    }
    contactsList.push(contactData);
    localStorage.setItem('contacts', JSON.stringify(contactsList));
    clearForm();
    resultAll();
    return true;
  }
  return false;
}

function clearForm() {
  fullName.value = "";
  phoneNumber.value = "";
  emailAddress.value = "";
  address.value = "";
  contactGroup.value = "";
  contactNotes.value = "";
  contactGroup.value = "";
  contactFavorite.checked = false;
  contactEmergency.checked = false;
  globalindex = null;
  contactNameError.classList.add("d-none");
  contactPhoneError.classList.add("d-none");
  contactEmailError.classList.add("d-none");
}
function deletContact(index) {
  var contactName = contactsList[index].name;
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contactName}? This action cannot be undone.`, 
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626", 
    cancelButtonColor: "#6b7280", 
    confirmButtonText: "Yes, delete it!",
    preConfirm : function() {
      contactsList.splice(index, 1)
      localStorage.setItem('contacts', JSON.stringify(contactsList));
      resultAll();
      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
}

function getGroupClass(group) {
  var validGroups = ["family", "friends", "work", "school", "other"];
  return validGroups.includes(group) ? group : "other";
}
function validateAll(element) {
  var regex = {
    fullName: /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/,
    phoneNumber: /^01[0125]\d{8}$/,
    emailAddress: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
  }
  var elementAlert = element.nextElementSibling;
  if (element.value.trim() === "") {
    elementAlert.classList.add("d-none");
    return element.id === "emailAddress"; 
  }
  if (regex[element.id].test(element.value)) {

    elementAlert.classList.add("d-none");
    return true;
  }
  else {

    elementAlert.classList.remove("d-none");
    return false;
  }
}



function toggleFavorite(index) {
  contactsList[index].favorite = (contactsList[index].favorite === true) ? false : true;
  localStorage.setItem('contacts', JSON.stringify(contactsList));
  resultAll();
}
function toggleEmergency(index) {
  contactsList[index].emergency = (contactsList[index].emergency === true) ? false : true;
  localStorage.setItem('contacts', JSON.stringify(contactsList));
  resultAll();
}

function updateCountersFav() {
  var count = 0;
  var counter = document.querySelector('.counter-fav');
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].favorite === true) {
      count++;
    }
  }
  counter.innerHTML = count;
  localStorage.setItem('contacts', JSON.stringify(contactsList));
  displayAllContacts();
}

function updateCountersEmergency() {
  var counter = document.querySelector('.counter-emergency');
  var count = 0;
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].emergency === true) {
      count++;
    }
  }
  counter.innerHTML = count;
  localStorage.setItem('contacts', JSON.stringify(contactsList));
  displayAllContacts();
}

function totalAllCotacts() {
  var total = document.querySelector('.total');
  total.innerHTML = contactsList.length;
  document.querySelector('.total-all').innerHTML = total.innerHTML = contactsList.length;
  localStorage.setItem('contacts', JSON.stringify(contactsList));
  displayAllContacts();
}
var globalindex;

function fillInputData(index) {
  fullName.value = contactsList[index].name;
  phoneNumber.value = contactsList[index].phone;
  emailAddress.value = contactsList[index].email;
  address.value = contactsList[index].address;
  contactGroup.value = contactsList[index].group;
  contactNotes.value = contactsList[index].notes;
  contactFavorite.checked = contactsList[index].favorite;
  contactEmergency.checked = contactsList[index].emergency;
  globalindex = index;
  var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();
}

function updateThisContact() {
  var validName = validateAll(fullName);
  var validPhone = validateAll(phoneNumber);
  var validEmail = validateAll(emailAddress);

  if (validName && validPhone && validEmail) {
    var contactData = {
      name: fullName.value,
      phone: phoneNumber.value,
      email: emailAddress.value,
      address: address.value,
      group: contactGroup.value,
      notes: contactNotes.value,
      favorite: contactFavorite.checked,
      emergency: contactEmergency.checked,
    }
    contactsList[globalindex] = contactData;
    localStorage.setItem('contacts', JSON.stringify(contactsList));
    resultAll();
    clearForm();
    return true;
  }
  return false;
}
function saveAddContactAndUpdate() {
  var isEdit = globalindex !== null;
 var validName = validateAll(fullName);
  if (!validName) {
    Swal.fire({
      title: "Missing Name",
      text: "Please enter a name for the contact!",
      icon: "error"
    });
    return;
  }

  var validPhone = validateAll(phoneNumber);
  if (!validPhone) {
    Swal.fire({
      title: "Missing Phone",
      text: "Please enter a phone number!",
      icon: "error"
    });
    return;
  }
 var isDuplicate = false;
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].phone === phoneNumber.value && i !== globalindex) {
      isDuplicate = true;
      break;
    }
  }
  if (isDuplicate) {
    Swal.fire({
      title: "Duplicate Phone",
      text: "This phone number is already saved for another contact!",
      icon: "error"
    });
    return;
  }
  var validEmail = validateAll(emailAddress);
  if (!validEmail) {
    return;
  }

  if (isEdit) {
    updateThisContact();
  } else {
    addContacts();
  }
   Swal.fire({
    title: isEdit ? "Updated!" : "Added!",
    text: isEdit ? "Contact has been updated successfully." : "Contact has been added successfully.",
    icon: "success",
    showConfirmButton: false,
    timer: 1500
  });
 var modalElement = document.getElementById('exampleModal');
  var modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) modalInstance.hide();
}
function searchContact(element) {
  var box = '';
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].name.toUpperCase().includes(element.value.toUpperCase()) ||
      contactsList[i].phone.toUpperCase().includes(element.value.toUpperCase()) ||
      contactsList[i].email.toUpperCase().includes(element.value.toUpperCase())) {
      box +=
        ` <div class="card-contact" onclick="showContactInAside(${i})">
              <div class="p-3 flex-grow-1">
                <div class="d-flex align-items-start gap-3">
                  <div class="position-relative flex-shrink-0 ">
                    <div class="icon-badge-contact "${avatarColors[i % avatarColors.length]}>${getFirstChar(contactsList[i].name)}</div>
                    
                      <div 
                      class="ring amber ${contactsList[i].favorite ? 'd-block' : 'd-none'}  icon-fav position-absolute  text-white rounded-circle d-flex justify-content-center align-items-center">
                      <i class="fa-solid fs-8 fa-star"></i>
                      </div>
                      <div
                      class="ring rose ${contactsList[i].emergency ? 'd-block' : 'd-none'}  icon-emergency position-absolute  text-white rounded-circle d-flex justify-content-center align-items-center">
                        <i class="fa-solid fs-8 fa-heart-pulse"></i>
                      </div>
                  </div>
                  <div class="flex-grow-1 pt-1 min-w-0">
                    <h3 class="gray-900 fw-semibold fs-base lh-base overflow-hidden">${contactsList[i].name}</h3>
                    <div class="d-flex gap-2 align-items-center mt-1">
                      <div class="phone-icon bg-blue"> 
                        <i class="fa-solid fa-phone blue"></i>
                      </div>
                      <span class="gray-500 fs-sm">${contactsList[i].phone}</span>
                    </div>
                  </div>
                </div>
                <div class="mt-3">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <div class="phone-icon bg-violet">
                      <i class="fa-solid violet fs-10  fa-envelope"></i>
                    </div>
                    <span class="gray-500 fs-sm">${contactsList[i].email}</span>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <div class="phone-icon bg-emerald">
                      <i class="fa-solid emerald  fs-10 fa-location-dot"></i>
                    </div>
                    <span class="gray-500 fs-sm">${contactsList[i].address}</span>
                  </div>
                </div>
                <div class="d-flex gap-2 flex-wrap mt-3">
                  <span
                    class="badge-group ${contactsList[i].group} py-1 px-2 rounded-2 align-items-center fw-semibold d-inline-flex text-capitalize fs-11">${contactsList[i].group}</span>
                </div>
              </div>
              <div class="footer-card px-3 d-flex justify-content-between align-items-center mt-auto">
                <div class="d-flex  left-icons align-items-center gap-2">
                  <a href="tel:${contactsList[i].phone}"
                    class="bg-emerald-50 text-decoration-none d-flex justify-content-center align-items-center "
                    title="Call">
                    <i class="fa-solid emerald fa-phone"></i>
                  </a>
                  <a href="mailto:${contactsList[i].email}" class="bg-violet-50 text-decoration-none btn">
                    <i class="fa-solid violet fa-envelope"></i>
                  </a>
                </div>
                <div class="d-flex  right-icons align-items-center gap-2">
                  <button class="btn-icon  amber-400 " onclick="toggleFavorite(${i})">
                    <i class="fa-${contactsList[i].favorite ? 'solid amber-400' : 'regular'} fa-star"></i>
                  </button>
                  <button class="btn-icon rose-500"  onclick="toggleEmergency(${i})">
                    <i class="${contactsList[i].emergency ? 'fa-solid fa-heart-pulse rose-500' : 'fa-regular fa-heart'}"></i>
                  </button>
                  <button class="btn-icon violet-500" onclick="fillInputData(${i})">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button onclick="deletContact(${i})"  class="btn-icon rose-600">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            </div>
    `
    }

    document.getElementById('cardShow').innerHTML = box;
  }
}
function getFirstChar(fullName) {
  var parts = fullName.trim().split(' ');
  var firstChar = parts[0].charAt(0).toUpperCase();
  var secondtchar = '';
  if (parts.length > 1) {
    secondtchar = parts[1].charAt(0).toUpperCase();
  }
  return firstChar + secondtchar;
}
function removeTemplet() {
  var remove = document.getElementById('templet');
  if (remove) {
    remove.classList.add('d-none');
  }
}
function removeTempletFav() {
  var removeFav = document.getElementById('favHide');
  if (removeFav) {
    removeFav.classList.add('d-none')
  }
}
function removeTempletEmergency() {
  var removeEmerg = document.getElementById('emergencyHide');
  // var removeIconEmerg = document.getElementById('icon-emergency')
  if (removeEmerg) {
    removeEmerg.classList.add('d-none');

  }
}
function displayFavorites() {
  var showFav = document.querySelector('.showFav');
  var box = '';
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].favorite === true) {
      box +=
        `   <div class="d-flex align-items-center gap-3">
              <div
                class="icon-badge-right ${avatarColors[i % avatarColors.length]} d-flex justify-content-center align-items-center text-white violet flex-shrink-0">
                ${getFirstChar(contactsList[i].name)}</div>
              <div class="flex-grow-1 min-w-0">
                <p class="mb-0 fs-sm fw-normal">${contactsList[i].name}</p>
                <p class="mb-0  fs-11 gray-500">${contactsList[i].phone}</p>
              </div>
              <a href="tel:${contactsList[i].phone}"
                class=" text-decoration-none phone-icon bg-emerald  d-flex justify-content-center align-items-center "
                title="Call">
                <i class="fa-solid fs-sm emerald fa-phone"></i>
              </a>
        </div> 
    `
    }
  }
  if (box === "") {
    showFav.innerHTML = `
      <div class="text-center py-4">
        <p class="gray-400 fs-sm">No favorites contacts</p>
      </div>
    `;
  } else {
    showFav.innerHTML = box;
  }
}
function displayEmergency() {
  var showEmergency = document.querySelector('.showEmergency');
  var box = '';
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].emergency === true) {
      box +=
        `   <div class="d-flex align-items-center gap-3">
              <div
                class="icon-badge-right ${avatarColors[i % avatarColors.length]} d-flex justify-content-center align-items-center text-white violet flex-shrink-0">
                ${getFirstChar(contactsList[i].name)}</div>
              <div class="flex-grow-1 min-w-0">
                <p class="mb-0 fs-sm fw-normal">${contactsList[i].name}</p>
                <p class="mb-0  fs-11 gray-500">${contactsList[i].phone}</p>
              </div>
              <a href="tel:${contactsList[i].phone}"
                class=" text-decoration-none phone-icon bg-emerald  d-flex justify-content-center align-items-center "
                title="Call">
                <i class="fa-solid fs-sm emerald fa-phone"></i>
              </a>
        </div> 
    `
    }
  }

  if (box === "") {
    showEmergency.innerHTML = `
      <div class="text-center py-4">
        <p class="gray-400 fs-sm">No favorites contacts</p>
      </div>
    `;
  } else {
    showEmergency.innerHTML = box;
  }

}
function displayAllContacts() {
  var hasFav = false;
  var hasEmergency = false;

  var box = "";
  for (var i = 0; i < contactsList.length; i++) {

    if (contactsList[i].favorite === true) {
      hasFav = true;
    }
    if (contactsList[i].emergency === true) {
      hasEmergency = true;
    }
    box += `
            <div class="card-contact" onclick="showContactInAside(${i})">
              <div class="p-3 flex-grow-1">
                <div class="d-flex align-items-start gap-3">
                  <div class="position-relative flex-shrink-0 ">
                    <div class="icon-badge-contact  ${avatarColors[i % avatarColors.length]} ">${getFirstChar(contactsList[i].name)}</div>
                    
                      <div 
                      class="ring amber ${contactsList[i].favorite ? 'd-block' : 'd-none'}  icon-fav position-absolute  text-white rounded-circle d-flex justify-content-center align-items-center">
                      <i class="fa-solid fs-8 fa-star"></i>
                      </div>
                      <div
                      class="ring rose ${contactsList[i].emergency ? 'd-block' : 'd-none'}  icon-emergency position-absolute  text-white rounded-circle d-flex justify-content-center align-items-center">
                        <i class="fa-solid fs-8 fa-heart-pulse"></i>
                      </div>
                  </div>
                  <div class="flex-grow-1 pt-1 min-w-0">
                    <h3 class="gray-900 fw-semibold fs-base lh-base overflow-hidden">${contactsList[i].name}</h3>
                    <div class="d-flex gap-2 align-items-center mt-1">
                      <div class="phone-icon bg-blue">
                        <i class="fa-solid fa-phone blue"></i>
                      </div>
                      <span class="gray-500 fs-sm">${contactsList[i].phone}</span>
                    </div>
                  </div>
                </div>
                <div class="mt-3">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <div class="phone-icon bg-violet">
                      <i class="fa-solid violet fs-10  fa-envelope"></i>
                    </div>
                    <span class="gray-500 fs-sm">${contactsList[i].email}</span>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <div class="phone-icon bg-emerald">
                      <i class="fa-solid emerald  fs-10 fa-location-dot"></i>
                    </div>
                    <span class="gray-500 fs-sm">${contactsList[i].address}</span>
                  </div>
                </div>
                <div class="d-flex gap-2 flex-wrap mt-3">
                  <span
                    class="badge-group ${getGroupClass(contactsList[i].group)} py-1 px-2 rounded-2 align-items-center fw-semibold d-inline-flex text-capitalize fs-11">${contactsList[i].group}</span>
                </div>
              </div>
              <div class="footer-card px-3 d-flex justify-content-between align-items-center mt-auto">
                <div class="d-flex  left-icons align-items-center gap-2">
                  <a href="tel:${contactsList[i].phone}"
                    class="bg-emerald-50 text-decoration-none d-flex justify-content-center align-items-center "
                    title="Call">
                    <i class="fa-solid emerald fa-phone"></i>
                  </a>
                  <a href="mailto:${contactsList[i].email}"  class="bg-violet-50 text-decoration-none btn">
                    <i class="fa-solid violet fa-envelope"></i>
                  </a>
                </div>
                <div class="d-flex  right-icons align-items-center gap-2">
                  <button class="btn-icon  amber-400 " onclick="toggleFavorite(${i})">
                    <i class="fa-${contactsList[i].favorite ? 'solid amber-400' : 'regular'} fa-star"></i>
                  </button>
                  <button class="btn-icon rose-500"  onclick="toggleEmergency(${i})">
                    <i class="${contactsList[i].emergency ? 'fa-solid fa-heart-pulse rose-500' : 'fa-regular fa-heart'}"></i>
                  </button>
                  <button class="btn-icon violet-500" onclick="fillInputData(${i})">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button onclick="deletContact(${i})"  class="btn-icon rose-600">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            </div>
        `
  }
  // =================== Hero Temple ===================
  if (contactsList.length > 0) {
    removeTemplet();
  }
  else {
    var remove = document.getElementById('templet');
    if (remove) {
      remove.classList.remove('d-none');
    }
  }

  document.getElementById('cardShow').innerHTML = box;

}

function showContactInAside() {
  var favorites = document.getElementById('favorites-section');
}

function resultAll() {
  displayAllContacts();
  displayFavorites();
  displayEmergency();
  updateCountersFav();
  updateCountersEmergency();
  totalAllCotacts();

}
resultAll();
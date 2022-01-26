let addMember = false

document.addEventListener('DOMContentLoaded', ()=> {
    const addBtn = document.querySelector('#join-community-btn');
    const memberFormContainer = document.querySelector('.container');
    addBtn.addEventListener('click', () => {
        addMember = !addMember;
        if (addMember) {
            memberFormContainer.style.display = 'block';
        } else {
            memberFormContainer.style.display = 'none';
        }
    });
    
})
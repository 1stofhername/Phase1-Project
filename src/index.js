let eventMember = false

document.addEventListener('DOMContentLoaded', ()=> {
    const improveBtn = document.querySelector('#event-community-btn');
    const eventFormContainer = document.querySelector('div.container#event');;
    improveBtn.addEventListener('click', () => {
        eventMember = !eventMember;
        if (eventMember) {
            eventFormContainer.style.display = 'block';
        } else {
            eventFormContainer.style.display = 'none';
        }
    });
    const addBtn = document.querySelector('#support-community-btn');
    const eventFormContainer = document.querySelector('div.container#support');;
    addBtn.addEventListener('click', () => {
        eventMember = !eventMember;
        if (eventMember) {
            eventFormContainer.style.display = 'block';
        } else {
            eventFormContainer.style.display = 'none';
        }
    })
    ;
    formHandler()   
});

const formHandler = ()=>{
    const form = document.getElementById('event-form');
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        console.log(e.target['facilitator'].value, e.target['event-title'].value, e.target.value)
    })
}




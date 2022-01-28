let eventCreate = false

document.addEventListener('DOMContentLoaded', ()=> {
    const improveBtn = document.querySelector('#improve-community-btn');
    const eventFormContainer = document.querySelector('div.container#event');

    improveBtn.addEventListener('click', () => {
        eventCreate = !eventCreate;
        if (eventCreate) {
            eventFormContainer.style.display = 'block';
        } else {
            eventFormContainer.style.display = 'none';
        }
    });
    submitHandler();
    fetchPost();

});


const submitHandler = ()=>{
    const form = document.getElementById('event-form');
    form.addEventListener('submit', (e)=>{
        let title = e.target['event-title'].value;
        let facilitator = e.target['facilitator'].value;
        let goals = e.target['goals'].value;
        let date = e.target['event-date'].value;
        let startTime = e.target['start-time'].value;
        let startTimeAmPm = e.target['start-time-am-pm'].value;
        let endTime = e.target['end-time'].value;
        let endTimeAmPm = e.target['end-time-am-pm'].value;

        e.preventDefault();
        ;

        const formData = new postEvent (title, facilitator, goals, date, startTime, startTimeAmPm, endTime, endTimeAmPm);
        formData.post()
    })
}

class postEvent {
    constructor(title, facilitator, goals, date, startTime, startTimeAmPm, endTime, endTimeAmPm){
        this.title = title;
        this.facilitator = facilitator;
        this.goals = goals;
        this.date = date;
        this.startTime = startTime+startTimeAmPm;
        this.endTime = endTime+endTimeAmPm;
        this.participants = 0        
    }
    post(){
        fetch('http://localhost:3000/posts', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/JSON',
                'Accept' : 'application/JSON'
            },
            body : JSON.stringify(this)
        }).then(postRenderer(this));

    }
}

const fetchPost = function (){
    fetch('http://localhost:3000/posts')
            .then((res)=>res.json())
            .then(postData=>postData.forEach(post => postRenderer(post)))
        }


const postRenderer = function (postObj) {
    const postCollection = document.querySelector('#post-container');
    const h2 = document.createElement('h2');

    postCollection.appendChild(h2);
    h2.innerHTML = postObj.title;
}

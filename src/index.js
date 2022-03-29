let eventCreate = false;
let resourceCreate = false;
let Search = false;
let isLoggedIn = false;
let user=null;

//Listens for 'improve' button click and Toggles post form

console.log(isLoggedIn);
const postType = document.getElementById('post-type-form');
postType.addEventListener('change', (e)=>{togglePostForms(e)})

function togglePostForms(e){
    const eventForm = document.getElementById("event-form");
    const needForm = document.getElementById("need-form");
    const resourceForm = document.getElementById('resource-form');
    const formTitle = document.getElementById('form-title');
    if(e.target.value === 'event'){
        eventForm.style.display="block";
        needForm.style.display="none";
        resourceForm.style.display="none";
        formTitle.innerHTML = 'Post a community event!'
    } else if (e.target.value === 'need'){
        needForm.style.display="block";
        eventForm.style.display="none";
        resourceForm.style.display="none";
        formTitle.innerHTML = 'Post a community need!'
    } 
    else if (e.target.value === 'resource'){
        formTitle.innerHTML = 'Be a community resource!'
        needForm.style.display="none";
        eventForm.style.display="none";
        resourceForm.style.display="block";
    }
}


document.addEventListener('DOMContentLoaded', ()=> {
    const improveBtn = document.querySelector('#improve-community-btn');
    const eventFormContainer = document.querySelector('div.container#post-form');

    improveBtn.addEventListener('click', () => {
        eventCreate = !eventCreate;
        if (eventCreate && isLoggedIn) {
            eventFormContainer.style.display = 'block';
            improveBtn.innerHTML = 'Hide post form';
        } else {
            !isLoggedIn? alert('Please login to continue'):null;
            eventFormContainer.style.display = 'none';
            improveBtn.innerHTML = 'Engage your community!';
            

        }
    });
    submitHandler();
    fetchPost();
    
   
});

//Login form

loginForm = document.getElementById('login');
loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    validateLogin({"username":`${e.target.username.value}`, "password":`${e.target.password.value}`})
})

//Login submit

function validateLogin(login){
    fetch('http://localhost:3000/users')
    .then(res=>res.json())
        .then(users=>users.forEach((user)=>{if(user.username===login.username){
            if(user.password===login.password){
                isLoggedIn=true;
                document.getElementById('login-form').style=("display:none");
                user=user.username
                console.log(user)
            } else {alert('Password incorrect')}
        }else {alert("Account doesn't exist")}}))
        .catch(function error (){
            alert("Something went wrong");
            console.log('error');
        })
}

//Post submit


const submitHandler = ()=>{
    const form = document.getElementById('event-form');
    form.addEventListener('submit', (e)=>{
        const improveBtn = document.querySelector('#improve-community-btn');
        const eventFormContainer = document.querySelector('div.container#event');
        let title = e.target['event-title'].value;
        let facilitator = e.target['facilitator'].value;
        let image = e.target['image'].value;
        let goals = e.target['goals'].value;
        let date = e.target['event-date'].value;
        let startTime = e.target['start-time'].value;
        let startTimeAmPm = e.target['start-time-am-pm'].value;
        let endTime = e.target['end-time'].value;
        let endTimeAmPm = e.target['end-time-am-pm'].value;
        
        e.preventDefault();

        //Hide event form after submit

        eventFormContainer.style.display = 'none';
        improveBtn.innerHTML = 'Engage your community!';

       
        //Instatiate event post class

        const formData = new Post (title, facilitator, image, goals, date, startTime, startTimeAmPm, endTime, endTimeAmPm);
        formData.postData();
        form.reset();
    });
};

class Post {
    constructor(title, facilitator, image, goals, date, startTime, startTimeAmPm, endTime, endTimeAmPm){
        this.title = title;
        this.facilitator = facilitator;
        this.image = image;
        this.goals = goals;
        this.date = date;
        this.startTime = startTime+startTimeAmPm;
        this.endTime = endTime+endTimeAmPm;
        this.participants = 0;   
    }
    postData(){
        fetch('http://localhost:3000/events', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/JSON',
                'Accept' : 'application/JSON'
            },
            body : JSON.stringify(this)
        }).then(res=>res.json(res.statusText === 'Created' ? alert('Event successfully added!'):null))
        .then(data=>postRenderer(data))
        .catch(function error (){
            alert("Something went wrong");
            console.log('error');
        })

    }
}

//Render cards

const fetchPost = function (){
    fetch('http://localhost:3000/events')
            .then((res)=>res.json())
            .then(postData=>postData.forEach(post => postRenderer(post)))
        }


const postRenderer = function (postObj) {
    const postCollection = document.querySelector('#post-container');
    const card = document.createElement('div');
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const attendBtn = document.createElement('button');
    const attendeeCnt = document.createElement('p');
    const time = document.createElement('p');
    const facilitator = document.createElement('p')

    postCollection.appendChild(card);
    card.classList.add('post-card');
    card.append(h2,img,p,facilitator,time,attendeeCnt,attendBtn);
    card.setAttribute('id', `${postObj.id}`);
    time.setAttribute('id', 'time')
    facilitator.setAttribute('id', 'facilitator')

    h2.innerHTML = postObj.title;
    p.innerHTML = postObj.goals;
    time.innerHTML = 'Date/Time: ' + postObj.date +'  '+ postObj.startTime+'-'+postObj.endTime;
    facilitator.innerHTML = 'Facilitator: ' + postObj.facilitator;

    attendBtn.innerHTML = 'Participate!';
    attendeeCnt.innerHTML = postObj.participants+' community members participating';
    img.src = postObj.image;

    h2.classList.add('card-title');
    p.classList.add('card-text')
    attendBtn.setAttribute('id', 'card-btn');
    attendeeCnt.classList.add('attendee-count');
    img.classList.add('card-img');
    img.setAttribute('onerror', 'this.src="https://images.pexels.com/photos/3797402/pexels-photo-3797402.jpeg"');

    //PATCH participants
    
    attendBtn.addEventListener('click', (e)=>{
        if(isLoggedIn){
        let newAttendeeCnt = postObj.participants +=1
      fetch(`http://localhost:3000/events/${card.id}`, {
        method : 'PATCH',
        headers : {
          'Content-Type' : 'application/JSON',
          'Accept' : 'application/JSON'
        },
        body : JSON.stringify({
          'participants' : newAttendeeCnt
        })
      }).then(res=>res.json())
      .then(data=>{attendeeCnt.innerHTML = data.participants+' community members participating'
    })      
    } else {
        alert('Please login to continue')
    }})
}



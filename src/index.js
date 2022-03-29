let eventCreate = false;
let resourceCreate = false;
let Search = false;
let isLoggedIn = false;
let currentUser=null;

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
    postFormSubmitHandler();
    fetchPost();
    renderLogin();
    
   
});

//Login form

function renderLogin (user){
    if(!isLoggedIn){
    const loginContainer = document.getElementById('login-container');
    const loginForm = document.createElement('form');
    const loginTitle = document.createElement('h2');
    const usernameInput = document.createElement('input');
    const passInput = document.createElement('input');
    const userLabel = document.createElement('label');
    const passLabel = document.createElement('label');
    const createAcct = document.createElement('p');
    const loginSub = document.createElement('input')

    const userAttr={type:"text", name:"username", id:"username", "required":""};
    const passAttr = {type:"password", name:"password", id:"password", "required":""}
    const subAttr={type:"submit", name:"sumbit", id:"sumbit", class:"submit-login", value:"Login"};
    
    loginContainer.appendChild(loginTitle);
    loginContainer.appendChild(loginForm);
    loginForm.setAttribute('id', 'login')
    loginForm.appendChild(userLabel);
    userLabel.setAttribute('for', 'username')
    loginForm.appendChild(usernameInput);
    handleSetAttributes(usernameInput, userAttr)
    loginForm.appendChild(passLabel);
    passLabel.setAttribute('for', 'password');
    passLabel.innerHTML="Password"
    loginForm.appendChild(passInput);
    handleSetAttributes(passInput, passAttr)
    loginForm.appendChild(loginSub);
    handleSetAttributes(loginSub, subAttr);
    loginForm.appendChild(createAcct);
    createAcct.innerHTML="Don't have an account? Create one";

    usernameInput.setAttribute('type',"text")
    loginTitle.innerHTML="Login to start building your community!";
    loginTitle.setAttribute('id', 'login-title');
    userLabel.innerHTML="Username";

    function handleSetAttributes(element, attributes) {
        Object.keys(attributes).forEach(attr=>{
            element.setAttribute(attr,attributes[attr])
        })
    }
    loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    loginFormSubmitHandler({"username":`${e.target.username.value}`, "password":`${e.target.password.value}`})
})} else { 
    const {userName, firstName, lastName, profilePhoto} = user;
const loginContainer = document.getElementById('login-container');
const img = document.createElement('img');

document.getElementById('login').style=("display:none");
document.getElementById('login-title').innerHTML=`Welcome, ${user.firstName}!`

loginContainer.appendChild(img);
img.setAttribute=('url', profilePhoto);
}
}




//Login submit

function loginFormSubmitHandler(login){
    fetch('http://localhost:3000/users')
    .then(res=>res.json())
        .then(users=>users.forEach((user)=>{if(user.userName===login.username){
            if(user.password===login.password){
                isLoggedIn=true;
                currentUser = user.userName;
                renderLogin(user);
            } else {
                alert('Password incorrect');
            }
        } else { 
            alert(`Username: \'${login.username}\' doesn't exist`)
        }}))
        .catch(function error (){
            alert("Something went wrong");
            console.log(error);
        })
}

function renderLogInDiv (user) {
    const {userName, firstName, lastName, profilePhoto} = user
    const loginContainer = document.getElementById('login-container');
    const img = document.createElement('img');

    document.getElementById('login').style=("display:none");
    document.getElementById('login-title').innerHTML=`Welcome, ${user.firstName}!`

    loginContainer.appendChild(img);
    img.setAttribute=('url', profilePhoto);

    

}



//Post submit


const postFormSubmitHandler = ()=>{
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



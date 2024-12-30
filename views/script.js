let body =document.querySelector("body")
let cursor = document.querySelector(".cursor")


body.addEventListener("mousemove",function(val){
    cursor.style.left =val.x+"px" 
    cursor.style.top =val.y+"px"
})


var tl = gsap.timeline()


tl.from(".navpart1 img",{
    y:-100,
    duration:1.3,
    opacity:-1,
})
tl.from(".navbar a",{
    y:-100,
    duration:1,
    opacity:-1,
    stagger:0.2
},"-=1")

tl.from(".navpart2",{
    y:-100,
    duration:1,
    opacity:-1,
},"-=1.8")



var time = gsap.timeline()

time.from(".roomfinder",{
    y:200,
    duration:2,
    opacity:-1,
    stagger:0.2,
    delay:0.1
})


time.from(".featurebox",{
    y:200,
    duration:2,
    opacity:-1,
    stagger:0.3,

},"-=1")



gsap.from(".family",{
    x:-150,
    duration:2,
    opacity:-1,
    scrollTrigger:{
        trigger:".family",
        scroller:"body",
    
        start:"top 90%"

    }


})

gsap.from(".student",{
    x:150,
    duration:2,
    opacity:-1,
    scrollTrigger:{
        trigger:".student",
        scroller:"body",
    
        start:"top 90%"

    }
    
})


gsap.from(".room11",{
    y:150,
    duration:2,
    opacity:0,
    stagger:0.2,
    scrollTrigger:{
        trigger:".room11",
        scroller:"body ",
    
        start:"top 92%"

    }
    
})

gsap.from(".room12",{
    y:150,
    duration:2,
    opacity:0,
    stagger:0.2,
    scrollTrigger:{
        trigger:".room12",
        scroller:"body ",
    
        start:"top 95%"

    }
    
})

gsap.from(".room13",{
    y:150,
    duration:2,
    delay:0.2,
    opacity:0,
    stagger:0.2,
    scrollTrigger:{
        trigger:".room13",
        scroller:"body ",
    
        start:"top 95-%"

    }
    
})


fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(dataa=>console.log(dataa))

console.log("jj",dataa)
//let parentCard = document.querySelector("#data-card")
const container = document.getElementById('data-cards');
json.forEach(item => {
    // Create a new div for each item
    console.log("a")
    const newElement = document.createElement('div');
    
    // Add some content (e.g., item title and body)
    newElement.innerHTML = `
        <h3>${item.category}</h3>
        <p>${item.description}</p>
    `;

    // Append the new element to the container
    container.appendChild(newElement);
});
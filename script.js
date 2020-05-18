var stack = [];
var point =0;
var obrac = 0;
var cbrac =0;
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const gestureZone = document.querySelector(".keyboard");

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture();
}, false); 

function handleGesture() {
    if (touchendX <= touchstartX) {
        document.querySelector(".functionKeys").classList.remove("swipeRight");
    }
    
    if (touchendX >= touchstartX) {
        document.querySelector(".functionKeys").classList.add("swipeRight");
    }
}
var display = function(){
var ans = evaluate();
    if(!isNaN(ans)){
        document.querySelector("#display2").value=ans;
    }else{
        document.querySelector("#display2").value="";
    }
}
var last = function(){
   return (document.querySelector("#display1").value).charAt(document.querySelector("#display1").value.length-1);
}
var specialChar = function(c){
    if(c=="e"||c=="!"||c=='π') return 1;
    else return 0;
}
function gamma(n) {  
    var g = 7, 
        p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if(n < 0.5) {
      return Math.PI / Math.sin(n * Math.PI) / gamma(1 - n);
    }
    else {
      n--;
      var x = p[0];
      for(var i = 1; i < g + 2; i++) {
        x += p[i] / (n + i);
      }
      var t = n + g + 0.5;
      return Math.sqrt(2 * Math.PI) * Math.pow(t, (n + 0.5)) * Math.exp(-t) * x;
    }
  }
  function factorial(n) {
      if(Number.isInteger(n)) return Math.round(gamma(n + 1));
      else return gamma(n + 1);
  }
var prec = function(c) {
    if(c=='s'||c=='c'||c=='t'||c=='l'||c=='L') return 5;
    else if(c=='!') return 4; 
    else if(c == '^'||c=='%') return 3; 
    else if(c == '*' || c == '/') return 2; 
    else if(c == '+' || c == '-') return 1; 
    else return -1; 
} 
var operator = function(c){
    if(c=="+"||c=="-"||c=="/"||c=="/"||c=="*"||c=="("||c==")"||c=="^"||c=="!"||c=='%'||c=='s'||c=='c'||c=='t'||c=='l'||c=='L') return 1;
    else return 0;
}

var makeInput = function(){
    var input = [];
    var str = document.querySelector("#display1").value;
    var x=0;
    for(var i=0;i<str.length;i++){
        if(str.charAt(i)=="l"){
            if(str.charAt(i+1)=="o"){
                input.push(str.charAt(i));
                i=i+2;
                x=i+1;
            }
            else{
                input.push('L');
                i=i+1;
                x=i+1;
            }
        }
        else if(str.charAt(i)=="s"||str.charAt(i)=="c"||str.charAt(i)=="t"){
            input.push(str.charAt(i));
            i=i+2;
            x=i+1;
        }
        else if(str.charAt(i)=="e"){    
            input.push(Math.exp(1));
            x=i+1;
        }
        else if(str.charAt(i)=="π"){
            input.push(Math.PI);
            x=i+1;
        }
        else { if(operator(str.charAt(i)) && str.charAt(i)!="."){
            input.push(str.slice(x,i));
            input.push(str.charAt(i));
            x=i+1;
        }
        }
    }
    input.push(str.slice(x,i));
    for(var j=0;j<obrac-cbrac;j++){
        input.push(')');
    }
    console.log(input);
    return input;
}
var postfixEvaluate = function(post){
    var var1;
    var var2;
    console.log(post);
    var pstack = [];
    for(var i=0; i< post.length ; i++) {
          if(!operator(post[i])) {
            pstack.push(Number(post[i]));
        }
        else {
            var1 = pstack.pop();
            if(post[i]!='!'&&post[i]!='s'&&post[i]!='c'&&post[i]!='t'&&post[i]!='l'&&post[i]!='L')var2 = pstack.pop();
            switch (post[i])  
            {  
                case '+': pstack.push(var2 + var1); break;  
                case '-': pstack.push(var2-var1); break;  
                case '*': pstack.push(var2*var1); break;  
                case '/': pstack.push(var2/var1); break;
                case '^': pstack.push((Math.pow(var2 , var1))); break;
                case '!': pstack.push(factorial(var1)); break; 
                case '%': pstack.push(var2*var1/100); break;  
                case 's': pstack.push(Math.sin(var1)); break;
                case 'c': pstack.push(Math.cos(var1)); break;
                case 't': pstack.push(Math.tan(var1)); break;
                case 'l': pstack.push(Math.log(var1)/Math.log(10)); break;
                case 'L': pstack.push(Math.log(var1)); break; 
                
            }
            
        }
    }
    var1=pstack.pop();
    if(stack.length==0) return var1;
}
var infixToPostfix = function(exp){
    var stack = [];
    postfix =[];
    for (var i = 0;i<exp.length; i++) 
    {   if(exp[i]!=""&&exp[i]!="n"){
            if (!operator(exp[i])) 
                postfix.push(exp[i]); 
            else if (exp[i] == '(') 
                stack.push(exp[i]);  
            else if (exp[i] == ')') 
            { 
                while (stack.length && stack[stack.length-1] != '('){ 
                    postfix.push(stack.pop());
                } 
                stack.pop();
            }
            else 
            {   if(exp[i]!='^'){
                    while (stack.length && prec(exp[i]) <= prec(stack[stack.length-1]))
                        postfix.push(stack.pop());  
                        stack.push(exp[i]);
                }
                else{
                    while (stack.length && prec(exp[i]) < prec(stack[stack.length-1]))
                        postfix.push(stack.pop());  
                        stack.push(exp[i]);
            } 
            }
        }
    }
    while (stack.length){ 
        postfix.push(stack.pop());
    }
    console.log(postfix);
    return postfix;
}
var evaluate = function(){
    return postfixEvaluate(infixToPostfix(makeInput()));
}
for(var i=0; i<10; i++) {
    document.querySelector("#num" + i).addEventListener("click", function() {
        if(specialChar(last())||last()==")"){
            document.querySelector("#display1").value += "*"+this.value;
        }
        else{
            document.querySelector("#display1").value += this.value;
        }
        display();
    });
}
for(var j=0;j<=6;j++){
    document.querySelector("#operator"+j).addEventListener("click", function(){
        if((!operator(last())&&last()!="")||last()=="!"){
            document.querySelector("#display1").value += this.value;
            point=0;
        }
       
    });
}
document.querySelector("#point").addEventListener("click", function(){
    if(point==0){
        document.querySelector("#display1").value += this.value;
        point=1;
    }
});
document.querySelector("#back").addEventListener("click", function() {
    document.querySelector("#display1").value = document.querySelector("#display1").value.slice(0, -1); ;
    ans = evaluate();
display();
    
});
document.querySelector("#equalto").addEventListener("click", function() {
    if(!isNaN(ans)){
        document.querySelector("#display1").value=ans;
        document.querySelector("#display2").value="";
    }else{
        document.querySelector("#display2").value="Wrong Input";
    }
    point=0;
});
document.querySelector("#obracket").addEventListener("click", function() {
    if((operator(last())||last()=='')&&last()!=')'){
        document.querySelector("#display1").value += this.value;
    }
    else{
        document.querySelector("#display1").value += '*'+this.value;
    }
    obrac++;
    point=0;
});
document.querySelector("#cbracket").addEventListener("click", function() {
    if((cbrac<obrac&&!operator(last()))||(cbrac<obrac&&last()==')')){
        document.querySelector("#display1").value += this.value;
        cbrac++;
    }
    display();
    point=0;
});
document.querySelector("#e").addEventListener("click", function() {
    if((operator(last())||last()=="")&&last()!=')'){
        document.querySelector("#display1").value+="e";
    }
    else{
        document.querySelector("#display1").value+="*e";
    }
    display();
    point=0;
});
document.querySelector("#pie").addEventListener("click", function() {
    if((operator(last())||last()=="")&&last()!=')'){
        document.querySelector("#display1").value+="π";
    }
    else{
        document.querySelector("#display1").value+="*π";
    }
    display();
    point=0;
});
document.querySelector("#sin").addEventListener("click", function() {
    if((operator(last())||last()=="")&&last()!=')'){
        document.querySelector("#display1").value+="sin(";
    }
    else{
        document.querySelector("#display1").value+="*sin(";
    }
    obrac++;
    point=0;
});
document.querySelector("#cos").addEventListener("click", function() {
    if((operator(last())||last()=="")&&last()!=')'){
        document.querySelector("#display1").value+="cos(";
    }
    else{
        document.querySelector("#display1").value+="*cos(";
    }
    obrac++;
    point=0;
});
document.querySelector("#tan").addEventListener("click", function() {
    if((operator(last())||last()=="")&&last()!=')'){
        document.querySelector("#display1").value+="tan(";
    }
    else{
        document.querySelector("#display1").value+="*tan(";
    }
    obrac++;
    point=0;
});
document.querySelector("#log").addEventListener("click", function() {
    if((operator(last())||last()=="")&&last()!=')'){
        document.querySelector("#display1").value+="log(";
    }
    else{
        document.querySelector("#display1").value+="*log(";
    }
    obrac++;
    point=0;
});
document.querySelector("#Ln").addEventListener("click", function() {
    if((operator(last())||last()=="")&&last()!=')'){
        document.querySelector("#display1").value+="Ln(";
    }
    else{
        document.querySelector("#display1").value+="*Ln(";
    }
    obrac++;
    point=0;
});
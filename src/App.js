import './App.css';
import firebase from 'firebase\app';
import 'firebase\firestore';
import 'firebase\auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBKCsip1F2sKCBPCx1teUC0rfFZ1r-Sohc",

  authDomain: "chat-app-dd59e.firebaseapp.com",

  projectId: "chat-app-dd59e",

  storageBucket: "chat-app-dd59e.appspot.com",

  messagingSenderId: "266829463358",

  appId: "1:266829463358:web:bfd63e774f2aa3945c366f",

  measurementId: "G-1BST76GV20"

})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {

  const [user] = useAuthState();

  return (
    <div className="App">
      <header>

      </header>

      <section>
         {user ? <ChatRoom/> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle =()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signINWithPopup(provider);
  }

return(
  <button onClick={signInWithGoogle}>Sign in with Google</button>
)

}

function SignOut(){
 return auth.currentUser && (
   <button onClick ={()=> auth.signOut()}>Sign Out</button>
 )
}

function ChatMessage(props){

  const {text,uid} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent': 'received';

  return(
    <div className={`message ${messageClass}`}>
      <img src ={photoURL}/>
      <p>{text}</p>
    </div>
  )


}


function ChatRoom(){
 const dummy = useRef()

 const messagesRef = firestore.collection('messages');

 const query = messagesRef.orderBy('createdAt').limit(25);
 const [messages] = useCollectionData(query,{idField:'id'});
 const [formValue, setFormValue] = useState('');

 const SendMessage = async(e) =>{
   e.preventDefault();
   const {uid,photoURL} = auth.currentUser;

   await messagesRef.add({
     text:formValue,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     uid,
     photoURL
   })

   setFormValue('');
   dummy.current.scrollIntoView({behavior:'smooth'});
 }


 return(
   <>
   <main>
     {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}

     <div ref={dummy}></div>
   </main>

    <form onSubmit={SendMessage}>

    <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>

    <button type="submit">SEND!</button>

    </form>
   
   </>
 )


}

export default App;

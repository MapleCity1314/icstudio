import { redirect } from 'next/navigation';

const App = () => {
  // 直接重定向到 /home
  redirect('/home');

  return <div>看到此页面说明出现错误</div>; 
}

export default App;
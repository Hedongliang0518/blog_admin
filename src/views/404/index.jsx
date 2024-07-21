import { useNavigate } from "react-router-dom";
import styles from './index.module.less';
const NotFind = () => {

  const navigateTo = useNavigate();

  // 返回首页
  const goHome = () => {
    navigateTo("/");
  }

  return <div className={styles.pageBox}>
    <img src="/public/imgs/page/404.png" className={styles.imgBox}/>
    <div className={styles.btnBox} onClick={goHome}>返回首页</div>
  </div>
}

export default NotFind
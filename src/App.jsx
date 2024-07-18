import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.less";
import { addCounter } from "./store/reducerModule/rootReducer";
const App = () => {
  const counter = useSelector((state) => state.rootReducer.counter);
  const dispatch = useDispatch();

  const add = () => {
    dispatch(addCounter(10));
  };
  return (
    <div className={styles.pageBox}>
      3333
      <div className={styles.pageItem} onClick={add}>
        {counter}
        <Button type="primary">Button</Button>
        aaaaaaaaaaaaa
      </div>
    </div>
  );
};

export default App;

import { getInfo, login } from "@/api/login";
import ThreePlus from "@/components/base";
import { Login, SetInfo } from "@/store/reducerModule/userReducer";
import { setToken } from "@/utils/auth";
import { Button, Form, Input } from "antd";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import styles from "./index.module.less";
// 导入gltf(3d模型)加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 压缩解压缩 draco
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// 导入反射库
import { Reflector } from "three/examples/jsm/objects/Reflector";
// 引入动画库
import gsap from "gsap";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navGateTo = useNavigate();

  const screenDomys = useRef()

  // 登录
  const onFinish = async (values) => {
    const res = await login(values)
    if(res.code === 200) {
      setToken(res.data.token);
      dispatch(Login(res))
      getMenuAndUserInfo()
      navGateTo("/home");
    }
  };

  // 获取菜单及用户信息
  const getMenuAndUserInfo = async () => {
    const res= await getInfo()
    if(res.code === 200) {
      dispatch(SetInfo(res))
    }
  }

  // 初始化页面
  let first = true
  const initPage = () => {
    if(first) {
      initScene();
      addBg();
      addModel()
      // addModel2()
      // addLight()
      // addPlan()
      // addReflector()
      move()
    }
    first = false
  }
  // 初始化场景
  let ThreeInstence;
  const initScene = () => {
    ThreeInstence = new ThreePlus(screenDomys.current, screenDomys.current.offsetWidth, screenDomys.current.offsetHeight);
    ThreeInstence.init(75, 1, 2000, { x: 0, y: 1, z: 10 }, true);
    ThreeInstence.resize()
  };

  // 添加星空背景
  const addBg = () => {
    const texture = new THREE.TextureLoader().load("./imgs/assets/25s.jpg");
    texture.mapping = THREE.EquirectangularReflectionMapping; // 球面效果
    ThreeInstence.background = texture;
    ThreeInstence.environment = texture;
  };

  // 加载模型
  const addModel = () => {
  // 实例化加载器DRACO
    const dracoLoader = new DRACOLoader();
    // 设置draco路劲
    dracoLoader.setDecoderPath("./draco/");
    // 实例化gltf加载器
    const gltfLoader = new GLTFLoader();
    // 设置gltf加载器draco解码器
    gltfLoader.setDRACOLoader(dracoLoader);
    // 加载模型
    gltfLoader.load("./imgs/model/moon.glb", (gltf) => {
      const moon = gltf.scene.children[0];
      let moonInstanced = new THREE.InstancedMesh(
        moon.geometry,
        moon.material,
        1000
      );
      for (let y = 0; y < 10; y++) {
        for (let i = 0; i < 1000; i++) {
        // 创建矩阵
          let matrix = new THREE.Matrix4();
          let size = Math.random() * 10 - 8;
          matrix.makeScale(size, size, size);
          matrix.makeTranslation(
            Math.random() * 1000 - 500, // -500 到 500
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500
          );
          moonInstanced.setMatrixAt(i, matrix);
        }
        ThreeInstence.scene.add(moonInstanced);
        gsap.to(moonInstanced.position, {
          duration: Math.random() * 10 + 2,
          z: -1000,
          ease: "linear",
          repeat: -1,
        });
      }
    });
  };

  // 加载机器人模型
  let gloGltf;
  const addModel2 = () => {
  // 实例化加载器DRACO
    const dracoLoader = new DRACOLoader();
    // 设置draco路劲
    dracoLoader.setDecoderPath("./draco/");
    // 实例化gltf加载器
    const gltfLoader = new GLTFLoader();
    // 设置gltf加载器draco解码器
    gltfLoader.setDRACOLoader(dracoLoader);
    // 加载模型
    gltfLoader.load("./imgs/model/robot.glb", (gltf) => {
      gloGltf = gltf.scene;
      gltf.scene.position.set(0, 0.5, 0);
      const model = gltf.scene;
      ThreeInstence.scene.add(model);
    });
  };

  // 设置光线
  const addLight = () => {
  // 平行直线光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(-10, 10, 10);
    ThreeInstence.scene.add(directionalLight);
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(-10, 10, -10);
    ThreeInstence.scene.add(directionalLight1);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    ThreeInstence.scene.add(directionalLight2);
  };

  // 添加光阵
  const addPlan = () => {
    const video = document.createElement("video");
    video.src = "./imgs/assets/zp2.mp4";
    video.loop = true; // 视频结尾的地方，自动返回视频开始的地方
    video.muted = true; // 音频会初始化为静音
    video.play();
    // 创建视频材质
    const videoTexture = new THREE.VideoTexture(video);
    // 创建平面
    const videoPlane = new THREE.PlaneGeometry(16, 9);
    // 设置平面材质
    const videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      transparent: true,
      side: THREE.DoubleSide,
      alphaMap: videoTexture, // 透明
    });
    const planeMesh = new THREE.Mesh(videoPlane, videoMaterial);
    planeMesh.position.set(0, 0.2, 0);
    planeMesh.rotation.set(-Math.PI / 2, 0, 0);
    planeMesh.scale.set(0.5, 0.5, 0);
    ThreeInstence.scene.add(planeMesh);
  };

  // 添加镜面反射
  const addReflector = () => {
  // 创建镜面
    const reflectorGeometry = new THREE.PlaneGeometry(10, 10);
    // 创建反射物体
    const reflectorPlane = new Reflector(reflectorGeometry, {
      textureWidth: window.innerWidth,
      textureHeight: window.innerHeight,
      color: 0x332222,
    });
    reflectorPlane.rotation.x = -Math.PI / 2;
    ThreeInstence.scene.add(reflectorPlane);
  };

  // 监听鼠标移动旋转模型
  const move = () => {
    window.addEventListener("mousemove", (e) => {
      if(!gloGltf) return
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;
      // 创建动画时间线对象
      let timeline = gsap.timeline();
      timeline.to(gloGltf.rotation, {
        duration: 0.5,
        x: y,
        y: x,
      });
    });
  };

  useEffect(() => {
    initPage();
  }
  , [])

  return (
    <div className={styles.loginPage}>
      <div className={styles.container} ref={screenDomys}></div>
      <div className={styles.loginBox}>
        <Form
          initialValues={{ userName: 'hedongliang', password: 'Hdl_0518' }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label=""
            name="userName"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item
            label=""
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{width: "100%"}}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;

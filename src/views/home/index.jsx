import * as THREE from "three";
// 导入轨道控制器
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ArticleCount from './compontents/articleCount';
import ArticlePier from './compontents/articlePier';
import ImgCount from './compontents/imgCount';
import TargetCount from './compontents/targetCount';
import styles from './index.module.less';
const Home = () => {
  // 坐标轴转换
  const lon2xyz = (R, longitude, latitude) => {
    let lon = -(longitude * Math.PI) / 180; // 转弧度值
    let lat = (latitude * Math.PI) / 180; // 转弧度值

    // 经纬度坐标转球面坐标
    const x = R * Math.cos(lat) * Math.cos(lon);
    const y = R * Math.sin(lat);
    const z = R * Math.cos(lat) * Math.sin(lon);
    // 返回球面坐标
    return new THREE.Vector3(x, y, z);
  };

  const screenDom = useRef()
  // 渲染元素的宽高
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  let observer;
  let scene = null;
  let renderer = null;
  let camera = null;
  // 初始化场景数据
  const initScene = () => {
    const width = screenDom.current.offsetWidth;
    const height = screenDom.current.offsetHeight;
    setWidth(width)
    setHeight(height)

    // 初始化场景
    scene = new THREE.Scene();
    // 初始化相机
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // 设置相机位置
    camera.position.set(0, 10, 270);

    // 初始化渲染器
    renderer = new THREE.WebGLRenderer({
    // 设置抗锯齿  不要有明显的锯齿感
      antialias: true,
    });

    // 渲染器大小
    renderer.setSize(width, height);
  };

  // 初始化控制器
  let controls = null;
  const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement);
    // 设置阻尼（惯性）
    controls.enableDamping = true;
    // 自动旋转
    controls.autoRotate = true;
  };

  // 创建星空背景
  const addBg = () => {
    scene.background = new THREE.Color(0x030311);
  };

  // 使用点材质创建星空效果
  const addXK = () => {
    const vertices = [];
    for (let i = 0; i < 500; i++) {
    // 创建三维向量 代表一个点
      const vertex = new THREE.Vector3();
      vertex.x = 800 * Math.random() - 400;
      vertex.y = 800 * Math.random() - 400;
      vertex.z = 800 * Math.random() - 400;
      vertices.push(vertex.x, vertex.y, vertex.z);
    }
    // 创建点
    let starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );

    // 加载点材质纹理
    const starsTexture = new THREE.TextureLoader().load(
      "./imgs/diqiu/images/stars.png"
    );
    const starsMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true, // 尺寸衰减
      color: 0x4d76cf,
      transparent: true,
      opacity: 1,
      map: starsTexture,
    });

    let stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
  };

  //创建地球
  const addEarth = () => {
  // 创建地球
    let earthGeometry = new THREE.SphereGeometry(50, 32, 32);
    let earthTexture = new THREE.TextureLoader().load("./imgs/diqiu/images/map.jpg");

    let earthMaterial = new THREE.MeshBasicMaterial({
      map: earthTexture,
    });
    let earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    // 发光地球
    let lightTexture = new THREE.TextureLoader().load("./imgs/diqiu/images/earth.jpg");
    let lightEarthGeometry = new THREE.SphereGeometry(53, 32, 32);
    let lightEarthMaterial = new THREE.MeshBasicMaterial({
      map: lightTexture,
      alphaMap: lightTexture, // 透明纹理
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    let lightEarth = new THREE.Mesh(lightEarthGeometry, lightEarthMaterial);
    scene.add(lightEarth);
  };

  // 添加地球内外发光精灵
  const addSprite = () => {
    let spriteTexture = new THREE.TextureLoader().load("./imgs/diqiu/images/glow.png");
    // 点精灵材质  外发光
    let spriteMaterial = new THREE.SpriteMaterial({
      map: spriteTexture,
      color: 0x4d76cf,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(155, 155, 0);
    scene.add(sprite);

    // 内发光
    let spriteTexture1 = new THREE.TextureLoader().load(
      "./imgs/diqiu/images/innerGlow.png"
    );
    let spriteMaterial1 = new THREE.SpriteMaterial({
      map: spriteTexture1,
      color: 0x4d76cf,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    let sprite1 = new THREE.Sprite(spriteMaterial1);
    sprite1.scale.set(128, 128, 0);
    scene.add(sprite1);
    let scale = new THREE.Vector3(1, 1, 1);

    for (let i = 0; i < 30; i++) {
    // 实现光柱
      let lightPillarTexture = new THREE.TextureLoader().load(
        "./imgs/diqiu/images/light_column.png"
      );
      let lightPillarGeometry = new THREE.PlaneGeometry(3, 20);
      let lightPillarMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: lightPillarTexture,
        alphaMap: lightPillarTexture,
        transparent: true,
        blending: THREE.AdditiveBlending, // 混合模式 为 叠加混合
        side: THREE.DoubleSide,
        depthWrite: false, // 是否对深度缓冲区有任何影响
      });
      let lightPillar = new THREE.Mesh(lightPillarGeometry, lightPillarMaterial);
      lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2));

      // 创建波纹扩散效果
      let circlePlane = new THREE.PlaneGeometry(6, 6);
      let circleTexture = new THREE.TextureLoader().load(
        "./imgs/diqiu/images/label.png"
      );
      let circleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: circleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      let circleMesh = new THREE.Mesh(circlePlane, circleMaterial);
      circleMesh.rotation.x = -Math.PI / 2;
      circleMesh.position.set(0, -7, 0);

      lightPillar.add(circleMesh);

      gsap.to(circleMesh.scale, {
        duration: 1 + Math.random() * 0.5,
        x: 2,
        y: 2,
        z: 2,
        repeat: -1, // 重复次数 (-1 表示无限循环)
        delay: Math.random() * 0.5,
        yoyo: true, // 如果 true > A-B-B-A, 如果 false > A-B-A-B
        ease: "power2.inOut",
      });

      // 设置光柱的位置

      lightPillar.position.set(0, 50, 0);

      let lat = Math.random() * 180 - 90;
      let lon = Math.random() * 360 - 180;
      let position = lon2xyz(60, lon, lat);
      lightPillar.position.set(position.x, position.y, position.z);
      // 将该四元数设置为从方向向量 vFrom 旋转到方向向量 vTo 所需的旋转  改点到原点的方向
      lightPillar.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        position.clone().normalize()
      );
      scene.add(lightPillar);
    }
  };

  // 添加运行月球
  const addMoon = () => {
    const moonTexture = new THREE.TextureLoader().load("./imgs/diqiu/images/moon.jpg");
    const moonGeometry = new THREE.SphereGeometry(5, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({
      map: moonTexture,
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(150, 0, 0);
    scene.add(moon);

    // 创建月球环
    const moonRingTexture = new THREE.TextureLoader().load(
      "./imgs/diqiu/images/moon_ring.png"
    );
    // 圆环缓冲几何体
    // const moonRingGeometry = new THREE.RingGeometry(145, 155, 64);
    // const moonRingMaterial = new THREE.MeshBasicMaterial({
    //   map: moonRingTexture,
    //   transparent: true,
    //   blending: THREE.AdditiveBlending,
    //   side: THREE.DoubleSide,
    //   depthWrite: false,
    //   opacity: 0.5,
    // });
    // const moonRing = new THREE.Mesh(moonRingGeometry, moonRingMaterial);
    // moonRing.rotation.x = -Math.PI / 2;
    // scene.add(moonRing);

    let time = {
      value: 0,
    };
    gsap.to(time, {
      value: 1,
      duration: 10,
      repeat: -1,
      ease: "linear",
      onUpdate: () => {
        moon.position.x = 150 * Math.cos(time.value * Math.PI * 2);
        moon.position.z = 150 * Math.sin(time.value * Math.PI * 2);
        moon.rotation.y = time.value * Math.PI * 8;
      },
    });
  };

  // 渲染函数
  // 定义渲染帧
  let _requestAnimationFrame;
  const render = () => {
  // 渲染场景相机
    renderer.render(scene, camera);
    // 更新轨道
    controls && controls.update();
    // 下一帧查询调用渲染函数
    _requestAnimationFrame = requestAnimationFrame(render);
  };

  let resizeTimer;
  const handleResize = (entries) => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // 设置渲染器宽高
        renderer.setSize(width, height);
        // 重置相机宽高比
        camera.aspect = width / height;
        // 重置相机投影矩阵
        camera.updateProjectionMatrix();
      }
    }, 200);
  };

  let first = true
  const initPage = () => {
    if(!first) return
    observer = new ResizeObserver(handleResize);
    observer.observe(screenDom.current);
    initScene();
    // 画布添加到元素
    screenDom.current.appendChild(renderer.domElement);
    initControls();
    addBg();
    addXK();
    addEarth();
    addSprite();
    addMoon();
    render();
    first = false
  }

  useEffect(() => {
    initPage()
  }, [])
  return (
    <div className={styles.home}>
      <div className={styles.container} ref={screenDom}></div>
      <div className={styles.leftBox}>
        <ImgCount />
        <ArticlePier/>
      </div>
      <div className={styles.rightBox}>
        <ArticleCount/>
        <TargetCount/>
      </div>
    </div>
  );
};

export default Home;

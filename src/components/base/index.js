import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入文字加载器
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
// 导入GUI工具
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export default class ThreePlus {
  constructor(selector, width, height) {
    this.scene = null // 场景
    this.camera = null // 相机
    this.domElement = selector // 元素
    this.width = width // 元素宽度
    this.height = height // 元素高度
    this.renderer = null // 渲染函数
    this.ambientLight = null // 环境光
    this.directionalLight = null // 平行光
    this.fontText = null // 文字
    this.resizeTimer = null // 自适应防抖
    this._requestAnimationFrame = null // 动画帧
    this.observer = null // 自适应监听器
    this.gui = null
    this.eventObj = null // 控制器事件
  }

  init = (angle = 45, near = 0.01, far = 1000, position, autoRender = true) => {
    this.initScene()
    this.initCamera(angle, near, far, position)
    this.initRenderer()
    autoRender && this.render()
  }

  // 初始化场景
  initScene = () => {
    this.scene = new THREE.Scene()
  }

  // 初始化相机
  initCamera = (angle, near, far, position) => {
    this.camera = new THREE.PerspectiveCamera(
      angle,
      this.width / this.height,
      near,
      far
    )
    this.camera.position.set(
      position?.x || 0,
      position?.y || 0,
      position?.z || 5
    )

    this.camera.aspect = this.width / this.height
    // 更新摄像机的投影矩阵
    this.camera.updateProjectionMatrix()
  }

  // 初始化render
  initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    this.renderer.setSize(this.width, this.height)
    // 使物体更加清晰
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.domElement.appendChild(this.renderer.domElement)
  }

  initAxesHelper = () => {
    // 创建坐标轴对象
    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)
  }

  // 初始化轨道
  initControl = () => {
    this.control = new OrbitControls(this.camera, this.renderer.domElement)
  }

  // 添加环境光
  initAmbLight = (color = 0xffffff, light = 1) => {
    this.ambientLight = new THREE.AmbientLight(color, light)
    this.scene.add(this.ambientLight)
  }

  // 添加方向光
  initDirectional = (color = 0xffffff, light = 1) => {
    this.directionalLight = new THREE.DirectionalLight(color, light)
    this.scene.add(this.directionalLight)
  }

  // 初始化文字
  initFontText = url => {
    return new Promise((resolve) => {
      new FontLoader().load(url, font => {
        this.fontText = font
        resolve(true)
      })
    })
  }

  // 渲染函数
  // 定义渲染帧
  render = () => {
    // 渲染场景相机
    this.renderer.render(this.scene, this.camera)
    // 更新轨道
    this.controls && this.controls.update()
    // 下一帧查询调用渲染函数
    this._requestAnimationFrame = requestAnimationFrame(this.render)
  }

  // 取消动画帧
  cancelAnimation = () => {
    cancelAnimationFrame(this._requestAnimationFrame)
  }

  // 自适应函数
  handleResize = entries => {
    clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(() => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        // 设置渲染器宽高
        this.renderer.setSize(width, height)
        // 重置相机宽高比
        this.camera.aspect = width / height
        // 重置相机投影矩阵
        this.camera.updateProjectionMatrix()
      }
    }, 200)
  }

  // 自适应
  resize = () => {
    this.observer = new ResizeObserver(this.handleResize)
    this.observer.observe(this.domElement)
  }

  initGui = () => {
    this.eventObj = {
      Fullscreen: () => {
        // 全屏
        if (this.domElement?.requestFullscreen) {
          this.domElement.requestFullscreen()
        } else if (this.domElement?.msRequestFullscreen) {
          this.domElement.msRequestFullscreen()
        } else if (this.domElement?.mozRequestFullScreen) {
          this.domElement.mozRequestFullScreen()
        } else if (this.domElement?.webkitRequestFullScreen) {
          this.domElement.webkitRequestFullScreen()
        }
      },
      ExitFullscreen: () => {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        }
      },
    }
    // 创建GUI
    this.gui = new GUI()
    this.gui.add(this.eventObj, 'Fullscreen').name('全屏')
    this.gui.add(this.eventObj, 'ExitFullscreen').name('退出全屏')
  }

  removeDom = () => {
    this.domElement.removeChild(this.renderer.domElement)
  }
}

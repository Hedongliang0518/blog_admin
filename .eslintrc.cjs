module.exports = {
  root: true,
  env: {
    browser: true, // 支持浏览器环境检测
    es2020: true, // 支持es2020语法检测
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    // “off” or 0 - 关闭规则
    // “warn” or 1 - 将规则视为一个警告（不会影响退出码）
    // “error” or 2 -将规则视为一个错误 (退出码为1)
    // quotes: ["error", "single"], // 使用单引号
    eqeqeq: 2, //必须使用全等
    "no-undef": 0,
    "no-constant-condition": 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    "no-dupe-keys": 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-dupe-args": 2, // 函数参数不能重复
    "no-duplicate-case": 2, // switch中的case标签不能重复
    "no-eq-null": 2, // 禁止对null使用==或!=运算符
    "no-extra-parens": 0, // 禁止非必要的括号
    "no-extra-semi": 2, // 禁止多余的冒号
    "no-func-assign": 2, // 禁止重复的函数声明
    "no-irregular-whitespace": 2, // 不能有不规则的空格
    "linebreak-style": [0, "windows"], // 换行风格
    "no-multi-spaces": 1, // 不能用多余的空格
    "no-trailing-spaces": 1, // 一行结束后面不要有空格
    "no-unreachable": 2, // 不能有无法执行的代码
    "no-var": 2, // 禁用var，用let和const代替
    camelcase: 2, // 强制驼峰法命名
    indent: [2, 2], // 缩进风格
    "init-declarations": 0, // 声明时必须赋初值
    "no-redeclare": 0, // 禁止重复声明变量
    "react/display-name": "off",
    "react/prop-types": "off", // 默认使用react/prop-types检查
  },
};

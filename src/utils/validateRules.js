/**
 * 检验表单为必填项
 * @param {String} msg
 * @returns
 */
export const requiredValidateRule = (msg) => ({
  required: true,
  message: msg || '该字段为必填项',
});

/**
 * 检验表单输入数字必须为整数
 */

export const integerValidateRule = (msg = '') => ({
  pattern: new RegExp(/^\d+$/),
  message: msg + '必须为非负整数',
});

/**
 * 检验登录密码规则
 * @description 登录密码规则：必须包含大写字母、小写字母、数字、至少8个字符
 * @returns
 */
export const passwordValidateRule = () => ({
  pattern: new RegExp(/^(?=.{8})(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d).*$/),
  message: '密码长度至少8个字符，且至少包含数字、小写字母、大写字母',
});

export const phoneValidateRule = () => ({
  pattern: new RegExp(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/),
  message: '请输入正确的手机号码',
});

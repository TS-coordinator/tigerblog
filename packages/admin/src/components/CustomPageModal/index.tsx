import { createCustomPage, updateCustomPage } from '@/services/van-blog/api';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Alert, Modal } from 'antd';

export default function (props) {
  const { onFinish, trigger, initialValues } = props;
  return (
    <ModalForm
      title={initialValues ? '修改自定义页面' : '新建自定义页面'}
      trigger={trigger}
      width={450}
      autoFocusFirstInput
      submitTimeout={3000}
      initialValues={initialValues || undefined}
      onFinish={async (values) => {
        if (location.hostname == 'blog-demo.mereith.com') {
          Modal.info({
            title: '演示站不可修改此项！',
          });
          return;
        }

        const path = values.path as string;
        if (path.substring(0, 1) != '/') {
          Modal.info({
            title: '路径必须以反斜杠为开头！',
          });
          return false;
        }
        if (initialValues) {
          await updateCustomPage({ ...values });
        } else {
          await createCustomPage(values);
        }
        if (onFinish) {
          onFinish();
        }
        return true;
      }}
      layout="horizontal"
      labelCol={{ span: 6 }}
    >
      {!initialValues && (
        <>
          <Alert
            style={{ marginBottom: 8 }}
            type="info"
            message="具体内容请在创建后在列表中点击对应操作按钮进行修改"
          ></Alert>
          <ProFormSelect
            width="md"
            name="type"
            required
            tooltip="单文件页面可直接通过后台内置编辑器编辑内容，比较方便；多文件页面需要上传相关文件，适合复杂场景。"
            label="类型"
            placeholder="请选择类型"
            rules={[{ required: true, message: '这是必填项' }]}
            initialValue={'folder'}
            request={async () => {
              return [
                { label: '单文件页面', value: 'file' },
                { label: '多文件页面', value: 'folder' },
              ];
            }}
          />
        </>
      )}
      <ProFormText
        width="md"
        required
        id="name"
        name="name"
        label="名称"
        placeholder="请输入名称"
        tooltip="自定义页面的名称"
        rules={[{ required: true, message: '这是必填项' }]}
      />
      <ProFormText
        disabled={initialValues && initialValues.type == 'folder'}
        width="md"
        required
        id="path"
        name="path"
        label="路径"
        placeholder="自定义页面的路径"
        tooltip="自定义页面的路径，需以反斜杠开头，会加载到 /c 路径下。"
        rules={[{ required: true, message: '这是必填项' }]}
      />
    </ModalForm>
  );
}

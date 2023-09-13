import { Button, ButtonProps } from "antd";

export const IconButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <div className="loft-editor-icon-adapt">
      <Button type="text" {...rest}>
        {children ? children : null}
      </Button>
    </div>
  );
};

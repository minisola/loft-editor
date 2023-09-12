import { Button, ButtonProps } from "antd";

export const IconButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button type="text" className="loft-editor-icon-adapt" {...rest}>
      {children ? children : null}
    </Button>
  );
};

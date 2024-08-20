import { useState, useEffect } from "react";
import PageModal from "../../../../components/PageModal";

const SelectedTools = (props) => {
  const { open, values, onUpdate, onCancel } = props || {};
  const [content, setContent] = useState("");
  let timer = null;

  useEffect(() => {
    setContent(values?.msg || "");
  }, [values]);

  useEffect(() => {
    // if (open) {
    //   timer = setTimeout(() => {
    //     onCancel();
    //   }, 3000);
    // } else {
    //   setContent("");
    // }
    // return () => {
    //   clearTimeout(timer);
    // };
  }, [open]);

  const handleSelectedTool = (item = {}) => {};
  return (
    <>
      {open && (
        <div className=" absolute top-[200px] right-[20px] p-6 w-[320px] border border-[#32f3fc] bg-black">
          <span className="mb-4 whitespace-pre-line">{content}</span>
        </div>
      )}
    </>
  );
};

export default SelectedTools;

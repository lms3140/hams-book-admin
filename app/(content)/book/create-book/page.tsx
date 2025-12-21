import "react-datepicker/dist/react-datepicker.css";
import { BookForm } from "../_components/BookForm";

export default function Page() {
  return (
    <div>
      <BookForm formType="create" />
    </div>
  );
}

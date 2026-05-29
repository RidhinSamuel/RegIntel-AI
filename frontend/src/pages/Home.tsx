import { type JSX } from "react";
import UploadForm from '../components/upload/UploadForm';

function Home(): JSX.Element {
  return (
    <main>
      <UploadForm />
    </main>
  );
}

export default Home;
import { Metadata } from "next";
import Dashboard from "./(Panel_Components)/Dashboard";

const PanelPage = () => {
  return (
    <div className="space-y-5">
      <Dashboard />
    </div>
  );
};

export default PanelPage;

export const metadata: Metadata = {
  title: "Dashboard",
};

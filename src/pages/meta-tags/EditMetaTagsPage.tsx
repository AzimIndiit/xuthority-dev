import { EditMetaTagsForm } from "@/components/meta-tags/EditMetaTagsForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const EditMetaTagsPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Meta tags data:", data);
    // Here you would typically make an API call to save the meta tags
    toast.success("Meta tags updated successfully!");
    // navigate("/admin/meta-tags"); // Navigate back to meta tags list
  };

  return (
    <div className="min-h-screen bg-white">
      <EditMetaTagsForm 
        onSubmit={handleSubmit}
        initialData={{
          pageName: "Landing Page",
          metaTitle: "Discover Top Business Software",
          metaDescription: "Discover top-rated business software tailored to your needs. Easily compare features, explore verified solutions, and read trusted user reviews—all in one place to help you make confident, informed decisions.",
        }}
      />
    </div>
  );
};
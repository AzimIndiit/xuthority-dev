import useUserStore from "@/store/useUserStore";

const Profile = () => {
  const { user } = useUserStore();
  return (
    <div> User {user?.role} Profile</div>
  )
}

export default Profile
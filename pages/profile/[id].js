import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { client, getProfile } from "../../api";

function Profile() {
	const [profile, setProfile] = useState();
	const router = useRouter();
	const { id } = router.query;
	useEffect(() => {
		if (id) {
			fetchProfile();
		}
	}, [id]);

	async function fetchProfile() {
		try {
			const response = await client.query(getProfile,{id}).toPromise();
			console.log(response);
			setProfile(response?.data?.profiles?.items[0]);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div style={{width:"100%",display:"flex",
		flexDirection:"column","justifyContent":"center",alignItems:"center",marginTop:"100px"}}>
			<div>
				{profile?.picture?.original?.url &&
				(profile?.picture?.original?.url).includes(
					"https://lens.infura-ipfs.io/"
				) ? (
					<Image
						src={profile?.picture?.original?.url}
						alt="Profile Picture"
						width={200}
						height={200}
					/>
				) : (
					<div>No Image</div>
				)}
			</div>
			<div style={{textAlign:"center"}}>
				<h4>{profile?.handle}</h4>
				<p>{profile?.bio}</p>
				<p>Followers: {profile?.stats?.totalFollowers}</p>
				<p>Following: {profile?.stats?.totalFollowing}</p>
			</div>
		</div>
	);
}

export default Profile;

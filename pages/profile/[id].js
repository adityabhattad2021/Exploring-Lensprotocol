import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment } from "react";
import { client, getProfile, getPublications } from "../../api";
import CONTRACT_ABI from "../../abi.json";

const CONTRACT_ADDRESS="0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

function Profile() {
	const [profile, setProfile] = useState();
	const [publications, setPublications] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { id } = router.query;
	useEffect(() => {
		if (id) {
			fetchProfile();
		}
	}, [id]);

	async function fetchProfile() {
		try {
			setIsLoading(true);
			const response = await client.query(getProfile, { id }).toPromise();
			console.log(response);
			setProfile(response?.data?.profiles?.items[0]);

			const publicationResponse = await client
				.query(getPublications, { id })
				.toPromise();
			// console.log(publicationResponse);
			setPublications(publicationResponse.data.publications.items);

			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	}
	console.log(publications[0]?.metadata?.content);

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				marginTop: "100px",
			}}
		>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<Fragment>
					<div>
						{profile?.picture?.original?.url &&
						(profile?.picture?.original?.url).includes(
							"https://lens.infura-ipfs.io/"
						) ? (
							<Image
								style={{ borderRadius: "100%" }}
								src={profile?.picture?.original?.url}
								alt="Profile Picture"
								width={200}
								height={200}
							/>
						) : (
							<div>No Image</div>
						)}
					</div>
					<div style={{ textAlign: "center" }}>
						<h4>{profile?.handle}</h4>
						<p>{profile?.bio}</p>
						<p>Followers: {profile?.stats?.totalFollowers}</p>
						<p>Following: {profile?.stats?.totalFollowing}</p>
					</div>
					{publications.map((publication, index) => {
						return (
							<div
								style={{
									padding: "20px",
									borderTop: "1px solid #ededed",
								}}
							>
								{publication?.metadata?.content}
							</div>
						);
					})}
				</Fragment>
			)}
		</div>
	);
}

export default Profile;

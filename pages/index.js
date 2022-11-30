import { useState, useEffect } from "react";
import { client, recommendedProfiles } from "../api";
import { useIsMounted } from "../hooks/useIsMounted";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {

	const mounted = useIsMounted();
	const [profiles, setProfiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchProfiles();
	}, []);

	async function fetchProfiles() {
		try {
			setIsLoading(true);
			const response = await client
				.query(recommendedProfiles)
				.toPromise();
			// console.log({ response });
			setProfiles(response.data.recommendedProfiles);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	}


	return (
		<div>
			<div style={{margin:"20px",width:"95%",display:"flex",flexDirection:"row-reverse"}}>
			<ConnectButton
				showBalance={true}
			/>
			</div>
			{isLoading && <div>Loading...</div>}
			{!isLoading &&
				profiles.map((profile, index) => {
					return (
						<Link href={`/profile/${profile?.id}`} key={index}>
							<div style={{ padding: "50px" }}>
								{profile?.picture?.original?.url &&
								(profile?.picture?.original?.url).includes(
									"https://lens.infura-ipfs.io/"
								) ? (
									<Image
										src={profile?.picture?.original?.url}
										alt="Profile Picture"
										width={60}
										height={60}
									/>
								) : (
									<div>No Image</div>
								)}
								<div style={{padding:"10px",fontWeight:"bold"}}>{profile?.handle}</div>
								{profile?.name}
								{profile?.bio}
							</div>
						</Link>
					);
				})}
		</div>
	);
}

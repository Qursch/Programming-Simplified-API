export default function emailTemplate (token: string) {
	return `
	<div class="container">
	<h1 class="title">Welcome to Programming Simplified!</h1>
	<a href="programmingsimplified.org/activate/${token}" class="link">
		Activate my account
	</a>
	
  </div>
  
  <style>
	.link {
	padding: 10px; 
	background-color: #6C7DFE; 
	border-radius: 5px; 
	text-decoration: none; 
	color: white;
	font-family: sans-serif;
	font-weight: 600;
	display: block;
	width: fit-content;
	margin-left: auto;
	margin-right: auto;
  }
  
  .title {
	font-family: sans-serif;
	text-align: center;
  }
  
  .container {
	display: block;
	margin-left: auto;
	margin-right: auto;
  }
  
  </style>
`;
}
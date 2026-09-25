export default function Table(rows=[]){

return `
<table>
${rows.map(r=>`<tr>${Object.values(r).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}
</table>
`;

}

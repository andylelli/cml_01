/**
 * Era and setting constraint templates
 */

export function buildEraConstraints(decade: string): string {
  const constraints: Record<string, string> = {
    "1920s": `1920s Era Constraints:
- Technology: No television, limited telephones, telegram primary distance communication
- Forensics: Fingerprinting new, no DNA, basic toxicology, blood typing primitive
- Transportation: Steam trains, early automobiles (unreliable), ocean liners, no commercial air travel
- Communication: Letters (days), telegrams (hours), telephone (rare, expensive)
- Social: Post-WWI trauma, rigid class structures, prohibition (US), women's suffrage new
- Policing: Scotland Yard methods, no forensic labs, gentleman amateur detectives common`,

    "1930s": `1930s Era Constraints:
- Technology: Radio common, early telephones in homes, no television, typewriters standard
- Forensics: Fingerprinting standard, basic toxicology, ballistics analysis emerging
- Transportation: Automobiles more reliable, passenger trains peak, early commercial aviation
- Communication: Telephone more common, telegrams faster, airmail available
- Social: Great Depression impact, class tensions, fascism rising in Europe
- Policing: Professional detectives emerging, forensic science developing`,

    "1940s": `1940s Era Constraints:
- Technology: Radio ubiquitous, early television (post-war), radar, code-breaking
- Forensics: Blood typing standard, ballistics good, some trace evidence analysis
- Transportation: Wartime restrictions (rationing, blackouts), post-war automobile boom
- Communication: Long-distance calls possible, military encryption legacy
- Social: WWII and post-war trauma, women in workforce, beginning of Cold War
- Policing: Military investigation techniques adapted, FBI modernizing`,

    "1950s": `1950s Era Constraints:
- Technology: Television spreading, early computers (room-sized), transistor radios
- Forensics: Serology advanced, microscopy improved, polygraph controversial
- Transportation: Commercial aviation growing, interstate highways beginning (US), cars common
- Communication: Direct dial phones spreading, no mobile phones, television news
- Social: Conformity pressure, suburbanization, Cold War paranoia, nuclear anxiety
- Policing: Professional detective work standardized, FBI crime labs expanding`,

    "1960s": `1960s Era Constraints:
- Technology: Color TV, mainframe computers, transistors common, no personal computers
- Forensics: Trace evidence analysis good, no DNA profiling, gas chromatography
- Transportation: Jet age, highways established, no security screening
- Communication: Direct dial common, international calls expensive, no internet
- Social: Social upheaval, questioning authority, civil rights, counterculture
- Policing: Miranda rights (1966), forensic science professionalizing`,
  };

  return constraints[decade] || constraints["1930s"];
}

export function buildLocationConstraints(location: string, institution: string): string {
  return `Location: ${location} (${institution})

Physical Constraints:
- Geography and layout enable specific movement patterns
- Architecture creates natural access restrictions
- Weather and climate affect timing and physical evidence
- Isolation level determines outside help availability
- Local customs and rules create behavioral constraints

${institution} Specific Rules:
- Access permissions and restricted areas
- Daily schedules and routine patterns
- Social hierarchies and reporting structures
- Expected behaviors and protocol violations
- Resources available for investigation`;
}
